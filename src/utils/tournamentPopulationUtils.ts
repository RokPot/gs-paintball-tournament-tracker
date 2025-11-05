import { RxDatabase } from 'rxdb';
import { DatabaseCollections } from 'services/rxdb/database';
import { TournamentDto } from 'types/dto/TournamentDto';
import Game from 'types/Game';
import { ITeam } from 'types/interfaces/ITeam';
import { ITournament } from 'types/interfaces/ITournament';
import { ITournamentGroup } from 'types/interfaces/ITournamentGroup';
import { ITournamentStage } from 'types/interfaces/ITournamentStage';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import TournamentStage from 'types/TournamentStage';

export type RxDatabaseType = RxDatabase<DatabaseCollections>;

/**
 * Populates teams for a tournament from teamIds
 */
export const populateTournamentTeams = async (
  tournamentData: TournamentDto,
  database: RxDatabaseType,
): Promise<Team[]> => {
  if (!tournamentData.teamIds?.length || !database) {
    return [];
  }

  try {
    const teamDocs = await database.collections.teams
      .find({
        selector: {
          _id: { $in: tournamentData.teamIds },
        },
      })
      .exec();

    return teamDocs.map((doc) => {
      const teamData = doc.toMutableJSON();
      return new Team(teamData as ITeam);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `Failed to populate teams for tournament ${tournamentData.id}:`,
      error,
    );
    return [];
  }
};

/**
 * Collects all game IDs from tournament stages and groups
 */
export const collectGameIdsFromTournament = (
  tournamentData: TournamentDto,
): string[] => {
  const allGameIds: string[] = [];

  if (!tournamentData.stages || tournamentData.stages.length === 0) {
    return allGameIds;
  }

  tournamentData.stages.forEach((stageDto) => {
    if (stageDto.groups && stageDto.groups.length > 0) {
      stageDto.groups.forEach((groupDto) => {
        if (groupDto.gameIds && groupDto.gameIds.length > 0) {
          allGameIds.push(...groupDto.gameIds);
        }
      });
    }
  });

  return allGameIds;
};

/**
 * Populates stages for a tournament, including groups and games
 */
export const populateTournamentStages = async (
  tournamentData: TournamentDto,
  allGames: Game[],
): Promise<TournamentStage[]> => {
  if (!tournamentData.stages || tournamentData.stages.length === 0) {
    return [];
  }

  try {
    // Create a map for quick game lookup
    const gamesMap = new Map<string, Game>();
    allGames.forEach((game) => {
      gamesMap.set(game._id, game);
    });

    // Populate stages with groups and games
    const stages = tournamentData.stages.map((stageDto) => {
      // Populate groups
      let groups: TournamentGroup[] = [];
      if (stageDto.groups && stageDto.groups.length > 0) {
        groups = stageDto.groups.map((groupDto) => {
          const groupGames: Game[] = [];
          if (groupDto.gameIds && groupDto.gameIds.length > 0) {
            groupDto.gameIds.forEach((gameId: string) => {
              const game = gamesMap.get(gameId);
              if (game) {
                groupGames.push(game);
              }
            });
          }

          return new TournamentGroup({
            ...groupDto,
            teams: [],
            games: groupGames,
          } as ITournamentGroup);
        });
      }

      // Populate schedule
      const schedule: TournamentScheduleGame[] = [];
      if (stageDto.schedule && stageDto.schedule.length > 0) {
        stageDto.schedule.forEach((scheduledGame) => {
          const scheduledGameGroup = groups?.find(
            (group) => group.id === scheduledGame.groupId,
          );
          const scheduledActiveGame = scheduledGameGroup?.games.find(
            (game) => game.id === scheduledGame.gameId,
          );
          if (scheduledGameGroup && scheduledActiveGame) {
            schedule.push({
              ...scheduledGame,
              group: scheduledGameGroup,
              game: scheduledActiveGame,
            });
          }
        });
      }

      return new TournamentStage({
        ...stageDto,
        schedule,
        groups,
      } as ITournamentStage);
    });

    return stages;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `Failed to populate stages for tournament ${tournamentData.id}:`,
      error,
    );
    return [];
  }
};

/**
 * Fully populates a tournament from tournament data (DTO)
 * This function is reusable for both services and observables
 *
 * @param tournamentData - The tournament DTO data
 * @param database - The RxDB database instance
 * @param getGames - Function to fetch games by IDs
 * @returns Fully populated Tournament instance
 */
export const populateTournament = async (
  tournamentData: TournamentDto,
  database: RxDatabaseType,
  getGames: (gameIds: string[]) => Promise<Game[]>,
): Promise<Tournament> => {
  // Populate teams
  const teams = await populateTournamentTeams(tournamentData, database);

  // Collect all game IDs and fetch games
  const allGameIds = collectGameIdsFromTournament(tournamentData);
  let allGames: Game[] = [];
  if (allGameIds.length > 0) {
    try {
      allGames = await getGames(allGameIds);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `Failed to populate games for tournament ${tournamentData.id}:`,
        error,
      );
    }
  }

  // Populate stages (includes groups and games)
  const stages = await populateTournamentStages(tournamentData, allGames);

  // Return fully populated Tournament
  return new Tournament({
    ...tournamentData,
    teams,
    stages,
  } as ITournament);
};
