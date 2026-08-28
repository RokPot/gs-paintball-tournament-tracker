import { addRxPlugin, createRxDatabase, RxCollection, RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateZSchemaStorage } from 'rxdb/plugins/validate-z-schema';
import { GameDto } from 'types/dto/GameDto';
import { LeaderboardTeamDto } from 'types/dto/LeaderboardTeamDto';
import { LeagueDto } from 'types/dto/LeagueDto';
import { TeamDto } from 'types/dto/TeamDto';
import { TournamentActivityDto } from 'types/dto/TournamentActivityDto';
import { TournamentDto } from 'types/dto/TournamentDto';
import { IActiveState } from 'types/interfaces/IActiveState';
import { activeStateSchema } from './schemas/activeStateSchema';
import { gameSchema } from './schemas/gameSchema';
import { leaderboardTeamSchema } from './schemas/leaderboardTeamSchema';
import { leagueSchema } from './schemas/leagueSchema';
import { teamSchema } from './schemas/teamSchema';
import { tournamentActivitySchema } from './schemas/tournamentActivitySchema';
import { tournamentSchema } from './schemas/tournamentSchema';

if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBMigrationSchemaPlugin);

const getStorage = () => {
  const dexieStorage = getRxStorageDexie();
  if (process.env.NODE_ENV !== 'development') {
    return dexieStorage;
  }
  return wrappedValidateZSchemaStorage({ storage: dexieStorage });
};

const ACTIVE_STATE_ID = 'active-state';

// Captured during league schema migrations so we can seed activeState.
let migratedSelectedLeagueId: string | null = null;

const stripLeagueSelectedFlag = (oldDoc: any) => {
  if (oldDoc.isLeagueSelected && !migratedSelectedLeagueId) {
    migratedSelectedLeagueId = oldDoc._id;
  }
  const next = { ...oldDoc };
  delete next.isLeagueSelected;
  return next;
};

const withCreatedAt = (oldDoc: any) => ({
  ...oldDoc,
  createdAt: oldDoc.createdAt || new Date().toISOString(),
});

export type DatabaseCollections = {
  tournaments: RxCollection<TournamentDto>;
  teams: RxCollection<TeamDto>;
  games: RxCollection<GameDto>;
  leagues: RxCollection<LeagueDto>;
  tournamentActivities: RxCollection<TournamentActivityDto>;
  activeState: RxCollection<IActiveState>;
  leaderboardTeams: RxCollection<LeaderboardTeamDto>;
};

export type RxDatabaseType = RxDatabase<DatabaseCollections>;

let dbPromise: Promise<RxDatabaseType> | null = null;

const toPersistedLeaderboardTeam = (
  leaderboardTeam: LeaderboardTeamDto,
): LeaderboardTeamDto => {
  const { team, ...stored } = leaderboardTeam;
  return stored;
};

/**
 * Get or create the RxDB database instance
 *
 * Storage: Dexie.js
 * See: https://rxdb.info/rx-storage.html
 */
export const getDatabase = async (): Promise<RxDatabaseType> => {
  if (!dbPromise) {
    dbPromise = createRxDatabase({
      name: 'gs-paintball-db-v5',
      storage: getStorage(),
      password: undefined,
      closeDuplicates: true,
    })
      .then(async (db: any) => {
        await db.addCollections({
          tournaments: {
            schema: tournamentSchema,
          },
          teams: {
            schema: teamSchema,
            migrationStrategies: {
              1: withCreatedAt,
              2: withCreatedAt,
            },
          },
          games: {
            schema: gameSchema,
            migrationStrategies: {
              1: (oldDoc: any) => oldDoc,
              2: (oldDoc: any) => oldDoc,
              3: (oldDoc: any) => oldDoc,
            },
          },
          leagues: {
            schema: { ...leagueSchema, version: 4 },
            migrationStrategies: {
              // v0 (flag on doc) -> v1
              1: stripLeagueSelectedFlag,
              // v1 stored with isLeagueSelected still in schema -> v2 without the field
              2: stripLeagueSelectedFlag,
              3: withCreatedAt,
              4: withCreatedAt,
            },
          },
          tournamentActivities: {
            schema: tournamentActivitySchema,
            migrationStrategies: {
              1: (oldDoc: any) => oldDoc,
              2: (oldDoc: any) => oldDoc,
              3: (oldDoc: any) => oldDoc,
            },
          },
          activeState: {
            schema: activeStateSchema,
          },
          leaderboardTeams: {
            schema: leaderboardTeamSchema,
          },
        });

        let activeStateDoc = await db.collections.activeState
          .findOne({ selector: { _id: ACTIVE_STATE_ID } })
          .exec();

        if (!activeStateDoc) {
          await db.collections.activeState.insert({
            _id: ACTIVE_STATE_ID,
            gameId: null,
            tournamentId: null,
            leagueId: null,
          });
          activeStateDoc = await db.collections.activeState
            .findOne({ selector: { _id: ACTIVE_STATE_ID } })
            .exec();
        }

        if (
          activeStateDoc &&
          !activeStateDoc.leagueId &&
          migratedSelectedLeagueId
        ) {
          const selectedLeague = await db.collections.leagues
            .findOne({ selector: { _id: migratedSelectedLeagueId } })
            .exec();
          await activeStateDoc.incrementalModify((oldData: any) => ({
            ...oldData,
            leagueId: migratedSelectedLeagueId,
            tournamentId: selectedLeague?.activeTournamentId || null,
          }));
        }

        return db;
      })
      .catch((error: unknown) => {
        dbPromise = null;
        throw error;
      }) as Promise<RxDatabaseType>;
  }

  return dbPromise;
};

export { toPersistedLeaderboardTeam };
