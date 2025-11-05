import { useCallback } from 'react';
import { useRxDB } from 'store/RxDBContext';
import { TournamentActivityDto } from 'types/dto/TournamentActivityDto';
import { TournamentDto } from 'types/dto/TournamentDto';
import Game from 'types/Game';
import { IGame } from 'types/interfaces/IGame';
import { ITournament } from 'types/interfaces/ITournament';
import { ITournamentActivity } from 'types/interfaces/ITournamentActivity';
import { ITournamentStage } from 'types/interfaces/ITournamentStage';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import TournamentActivity from 'types/TournamentActivity';
import TournamentStage from 'types/TournamentStage';
import { populateTournament } from 'utils/tournamentPopulationUtils';
import useGameServiceRxDB from './GameServiceRxDB';
import useTeamServiceRxDB from './TeamServiceRxDB';

/**
 * TournamentService using RxDB
 *
 *
 * Usage:
 * const { addNewTournament, getTournament } = useTournamentServiceRxDB();
 */
const useTournamentServiceRxDB = () => {
  const { database } = useRxDB();

  // Use RxDB GameService for populating games in groups and activities
  const { getGames, getGame } = useGameServiceRxDB();

  // Use RxDB TeamService for populating teams in groups
  const { getTeams } = useTeamServiceRxDB();

  const addNewTournament = useCallback(
    async (tournament: TournamentDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      // Validate required fields
      if (!tournament.id || !tournament.name || !tournament.state) {
        throw new Error(
          'Missing required tournament fields: id, name, or state',
        );
      }

      try {
        const insertedDoc =
          await database.collections.tournaments.insert(tournament);
        const tournamentData = insertedDoc.toMutableJSON();

        const stages =
          tournamentData.stages?.map((stageDto) => {
            return new TournamentStage({
              ...stageDto,
              groups: [],
              schedule: [],
            } as ITournamentStage);
          }) || [];

        return new Tournament({
          ...tournamentData,
          stages,
        } as ITournament);
      } catch (error: any) {
        if (error.name === 'RxError' && error.code === 'VD2') {
          // Validation error
          throw new Error(`Tournament validation failed: ${error.message}`);
        }
        throw new Error(`Failed to create tournament: ${error.message}`);
      }
    },
    [database],
  );

  const updateTournament = useCallback(
    async (tournament: TournamentDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!tournament._id) {
        throw new Error('Tournament _id is required for update');
      }

      try {
        const existing = await database.collections.tournaments
          .findOne({ selector: { _id: tournament._id } })
          .exec();

        if (!existing) {
          throw new Error(`Tournament with id ${tournament._id} not found`);
        }

        await existing.incrementalModify((oldData) => ({
          ...oldData,
          ...tournament,
        }));

        const tournamentData = existing.toMutableJSON();

        const stages =
          tournamentData.stages?.map((stageDto) => {
            return new TournamentStage({
              ...stageDto,
              groups: [],
              schedule: [],
            } as ITournamentStage);
          }) || [];

        return new Tournament({
          ...tournamentData,
          stages,
        } as ITournament);
      } catch (error: any) {
        if (error.message.includes('not found')) {
          throw error; // Re-throw not found errors as-is
        }
        throw new Error(`Failed to update tournament: ${error.message}`);
      }
    },
    [database],
  );

  const deleteTournament = useCallback(
    async (tournament: TournamentDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!tournament._id) {
        throw new Error('Tournament _id is required for deletion');
      }

      try {
        const tournamentDoc = await database.collections.tournaments
          .findOne({ selector: { _id: tournament._id } })
          .exec();

        if (!tournamentDoc) {
          throw new Error(`Tournament with id ${tournament._id} not found`);
        }

        // Remove the tournament
        await tournamentDoc.remove();

        return true;
      } catch (error: any) {
        if (error.message.includes('not found')) {
          throw error; // Re-throw not found errors as-is
        }
        throw new Error(`Failed to delete tournament: ${error.message}`);
      }
    },
    [database],
  );

  const getTournament = useCallback(
    async (tournamentId: string) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!tournamentId) {
        throw new Error('Tournament ID is required');
      }

      try {
        const tournamentDoc = await database.collections.tournaments
          .findOne({ selector: { _id: tournamentId } })
          .exec();

        if (!tournamentDoc) {
          return undefined;
        }

        const tournamentData = tournamentDoc.toMutableJSON();

        // Use shared utility function to populate tournament
        return await populateTournament(tournamentData, database, getGames);
      } catch (error: any) {
        throw new Error(`Failed to get tournament: ${error.message}`);
      }
    },
    [database, getGames, getTeams],
  );

  const getTournaments = useCallback(
    async (tournamentIds?: string[]) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      try {
        // Build selector - if tournamentIds provided, filter by them
        // Query by id (indexed field) since tournamentIds arrays typically contain id values
        const selector: any = {};
        if (tournamentIds && tournamentIds.length > 0) {
          selector.id = { $in: tournamentIds };
        }

        let tournamentDocs = await database.collections.tournaments
          .find({ selector })
          .exec();

        // If no results found, try _id as fallback (in case tournaments use _id instead of id)
        if (
          tournamentIds &&
          tournamentIds.length > 0 &&
          tournamentDocs.length === 0
        ) {
          const selectorById = { _id: { $in: tournamentIds } };
          tournamentDocs = await database.collections.tournaments
            .find({ selector: selectorById })
            .exec();
        }

        // Use shared utility function to populate all tournaments
        const tournaments = await Promise.all(
          tournamentDocs.map(async (doc) => {
            const tournamentData = doc.toMutableJSON();
            const populatedTournament = await populateTournament(
              tournamentData,
              database,
              getGames,
            );
            return populatedTournament;
          }),
        );

        return tournaments;
      } catch (error: any) {
        throw new Error(`Failed to get tournaments: ${error.message}`);
      }
    },
    [database, getGames],
  );

  const addNewTournamentActivity = useCallback(
    async (activity: TournamentActivityDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      // Validate required fields
      if (
        !activity.id ||
        !activity.tournamentId ||
        !activity.gameId ||
        !activity.changeType ||
        activity.stage === undefined ||
        !activity.updatedAt
      ) {
        throw new Error(
          'Missing required activity fields: id, tournamentId, gameId, changeType, stage, or updatedAt',
        );
      }

      try {
        await database.collections.tournamentActivities.insert(activity);
        return true;
      } catch (error: any) {
        if (error.name === 'RxError' && error.code === 'VD2') {
          // Validation error
          throw new Error(`Activity validation failed: ${error.message}`);
        }
        throw new Error(`Failed to create activity: ${error.message}`);
      }
    },
    [database],
  );

  const getTournamentActivity = useCallback(
    async (tournamentId: string) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!tournamentId) {
        throw new Error('Tournament ID is required');
      }

      try {
        const activityDocs = await database.collections.tournamentActivities
          .find({
            selector: {
              tournamentId,
            },
          })
          .exec();

        const sortedActivities = activityDocs
          .map((doc) => doc.toMutableJSON())
          .sort((a, b) => {
            const dateA = new Date(a.updatedAt).getTime();
            const dateB = new Date(b.updatedAt).getTime();
            return dateB - dateA;
          });

        const activities = await Promise.all(
          sortedActivities.map(async (activityData) => {
            let game: Game | null = null;
            if (activityData.gameId) {
              try {
                game = await getGame(activityData.gameId);
                if (game) {
                  game = new Game({
                    ...game,
                    team1: new Team({} as any),
                    team2: new Team({} as any),
                  } as IGame);
                }
              } catch (error) {
                // eslint-disable-next-line no-console
                console.warn(
                  `Failed to populate game for activity ${activityData.id}:`,
                  error,
                );
              }
            }

            return new TournamentActivity({
              ...activityData,
              updatedAt: new Date(activityData.updatedAt),
              game: game || ({} as ITournamentActivity),
            } as ITournamentActivity);
          }),
        );

        return activities;
      } catch (error: any) {
        throw new Error(`Failed to get tournament activity: ${error.message}`);
      }
    },
    [database, getGame],
  );

  return {
    addNewTournament,
    updateTournament,
    deleteTournament,
    getTournament,
    getTournaments,
    getTournamentActivity,
    addNewTournamentActivity,
  };
};

export default useTournamentServiceRxDB;
