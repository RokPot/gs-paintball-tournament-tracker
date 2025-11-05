import { addRxPlugin, createRxDatabase, RxCollection, RxDatabase } from 'rxdb';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { GameDto } from 'types/dto/GameDto';
import { LeagueDto } from 'types/dto/LeagueDto';
import { TeamDto } from 'types/dto/TeamDto';
import { TournamentActivityDto } from 'types/dto/TournamentActivityDto';
import { TournamentDto } from 'types/dto/TournamentDto';
import { IActiveState } from 'types/interfaces/IActiveState';
import { activeStateSchema } from './schemas/activeStateSchema';
import { gameSchema } from './schemas/gameSchema';
import { leagueSchema } from './schemas/leagueSchema';
import { teamSchema } from './schemas/teamSchema';
import { tournamentActivitySchema } from './schemas/tournamentActivitySchema';
import { tournamentSchema } from './schemas/tournamentSchema';

// Add migration plugin to handle schema version changes
addRxPlugin(RxDBMigrationSchemaPlugin);

// Define the database collections type
// Note: tournamentStages is not a separate collection - stages are embedded in tournaments
// All DTOs now use DTO types instead of class types, preventing "Map maximum size exceeded" errors
export type DatabaseCollections = {
  tournaments: RxCollection<TournamentDto>;
  teams: RxCollection<TeamDto>;
  games: RxCollection<GameDto>;
  leagues: RxCollection<LeagueDto>;
  tournamentActivities: RxCollection<TournamentActivityDto>;
  activeState: RxCollection<IActiveState>;
};

export type RxDatabaseType = RxDatabase<DatabaseCollections>;

let dbPromise: Promise<RxDatabaseType> | null = null;

/**
 * Get or create the RxDB database instance
 *
 * Storage: Dexie.js
 * - For premium features, consider IndexedDB (requires RxDB premium license)
 *
 * See: https://rxdb.info/rx-storage.html
 */
export const getDatabase = async (): Promise<RxDatabaseType> => {
  if (!dbPromise) {
    dbPromise = createRxDatabase({
      name: 'gs-paintball-db-v4', // Changed name to force fresh database after schema changes
      storage: getRxStorageDexie(), // Dexie.js storage (IndexedDB) - better performance
      password: undefined, // Optional: enable encryption if needed
    }).then(async (db) => {
      // Add collections with schemas
      // Note: Stages and groups are embedded in tournaments, not separate collections
      await db.addCollections({
        tournaments: {
          schema: tournamentSchema,
        },
        teams: {
          schema: teamSchema,
        },
        games: {
          schema: gameSchema,
        },
        leagues: {
          schema: leagueSchema,
        },
        tournamentActivities: {
          schema: tournamentActivitySchema,
        },
        activeState: {
          schema: activeStateSchema,
        },
      });

      return db;
    }) as Promise<RxDatabaseType>;
  }

  return dbPromise;
};
