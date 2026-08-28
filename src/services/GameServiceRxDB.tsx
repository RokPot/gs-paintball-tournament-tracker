import { useCallback } from 'react';
import { useRxDB } from 'store/RxDBContext';
import Game from 'types/Game';
import { GameDto } from 'types/dto/GameDto';
import useTeamServiceRxDB from './TeamServiceRxDB';

/**
 * GameService using RxDB
 *
 *
 * Usage:
 * const { addNewGame, getGame } = useGameServiceRxDB();
 */
const useGameServiceRxDB = () => {
  const { database } = useRxDB();

  // Use RxDB TeamService for populating teams in games
  const { getTeam } = useTeamServiceRxDB();

  const addNewGame = useCallback(
    async (game: GameDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      // Validate required fields
      if (!game.id || !game.team1Id || !game.team2Id || !game.gameState) {
        throw new Error(
          'Missing required game fields: id, team1Id, team2Id, or gameState',
        );
      }

      try {
        // Insert game into RxDB (insert returns the document)
        const insertedDoc = await database.collections.games.insert(game);
        const gameData = insertedDoc.toMutableJSON();

        // Populate teams (if needed)
        let team1 = null;
        let team2 = null;
        if (gameData.team1Id) {
          try {
            team1 = await getTeam(gameData.team1Id);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(
              `Failed to populate team1 for game ${gameData.id}:`,
              error,
            );
          }
        }
        if (gameData.team2Id) {
          try {
            team2 = await getTeam(gameData.team2Id);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(
              `Failed to populate team2 for game ${gameData.id}:`,
              error,
            );
          }
        }

        // Return as Game instance
        return new Game({
          ...gameData,
          team1: team1 || ({} as any),
          team2: team2 || ({} as any),
        } as any);
      } catch (error: any) {
        if (error.name === 'RxError' && error.code === 'VD2') {
          // Validation error
          throw new Error(`Game validation failed: ${error.message}`);
        }
        throw new Error(`Failed to create game: ${error.message}`);
      }
    },
    [database, getTeam],
  );

  const addNewGameBatch = useCallback(
    async (games: GameDto[]) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!games || games.length === 0) {
        throw new Error('Games array is required and cannot be empty');
      }

      // Validate all games
      const invalidGame = games.find(
        (game) => !game.id || !game.team1Id || !game.team2Id || !game.gameState,
      );
      if (invalidGame) {
        throw new Error(
          `Missing required game fields for game ${
            invalidGame.id || 'unknown'
          }: id, team1Id, team2Id, or gameState`,
        );
      }

      try {
        // RxDB bulk insert
        await database.collections.games.bulkInsert(games);
        return true;
      } catch (error: any) {
        throw new Error(`Failed to create games batch: ${error.message}`);
      }
    },
    [database],
  );

  const updateGame = useCallback(
    async (game: GameDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!game._id) {
        throw new Error('Game _id is required for update');
      }

      try {
        // Get existing game document
        const existing = await database.collections.games
          .findOne({ selector: { _id: game._id } })
          .exec();

        if (!existing) {
          throw new Error(`Game with id ${game._id} not found`);
        }

        // Update the game using incrementalModify
        await existing.incrementalModify((oldData: any) => ({
          ...oldData,
          ...game,
        }));

        const gameData = existing.toMutableJSON();

        // Populate teams (if needed)
        let team1 = null;
        let team2 = null;
        if (gameData.team1Id) {
          try {
            team1 = await getTeam(gameData.team1Id);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(
              `Failed to populate team1 for game ${gameData.id}:`,
              error,
            );
          }
        }
        if (gameData.team2Id) {
          try {
            team2 = await getTeam(gameData.team2Id);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(
              `Failed to populate team2 for game ${gameData.id}:`,
              error,
            );
          }
        }

        return new Game({
          ...gameData,
          team1: team1 || ({} as any),
          team2: team2 || ({} as any),
        } as any);
      } catch (error: any) {
        if (error.message.includes('not found')) {
          throw error; // Re-throw not found errors as-is
        }
        throw new Error(`Failed to update game: ${error.message}`);
      }
    },
    [database, getTeam],
  );

  const deleteGame = useCallback(
    async (game: GameDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!game._id) {
        throw new Error('Game _id is required for deletion');
      }

      try {
        const gameDoc = await database.collections.games
          .findOne({ selector: { _id: game._id } })
          .exec();

        if (!gameDoc) {
          throw new Error(`Game with id ${game._id} not found`);
        }

        // Remove the game
        await gameDoc.remove();

        return true;
      } catch (error: any) {
        if (error.message.includes('not found')) {
          throw error; // Re-throw not found errors as-is
        }
        throw new Error(`Failed to delete game: ${error.message}`);
      }
    },
    [database],
  );

  const getGame = useCallback(
    async (gameId: string) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!gameId) {
        throw new Error('Game ID is required');
      }

      try {
        const gameDoc = await database.collections.games
          .findOne({ selector: { _id: gameId } })
          .exec();

        if (!gameDoc) {
          return null;
        }

        const gameData = gameDoc.toMutableJSON();

        // Populate teams
        let team1 = null;
        let team2 = null;
        if (gameData.team1Id) {
          try {
            team1 = await getTeam(gameData.team1Id);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(`Failed to populate team1 for game ${gameId}:`, error);
          }
        }
        if (gameData.team2Id) {
          try {
            team2 = await getTeam(gameData.team2Id);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(`Failed to populate team2 for game ${gameId}:`, error);
          }
        }

        // Return as Game instance
        return new Game({
          ...gameData,
          team1: team1 || ({} as any),
          team2: team2 || ({} as any),
        } as any);
      } catch (error: any) {
        throw new Error(`Failed to get game: ${error.message}`);
      }
    },
    [database, getTeam],
  );

  const getGames = useCallback(
    async (gameIds?: string[]) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      try {
        // Build selector - if gameIds provided, filter by them
        // Query by id (indexed field) since gameIds arrays typically contain id values
        const selector: any = {};
        if (gameIds && gameIds.length > 0) {
          selector.id = { $in: gameIds };
        }

        let gameDocs = await database.collections.games
          .find({ selector })
          .exec();

        if (gameIds && gameIds.length > 0 && gameDocs.length < gameIds.length) {
          const matchedIds = new Set(
            gameDocs.flatMap((doc: any) => {
              const data = doc.toMutableJSON();
              return [data.id, data._id].filter(Boolean);
            }),
          );
          const missingIds = gameIds.filter((id) => !matchedIds.has(id));
          if (missingIds.length > 0) {
            const extraDocs = await database.collections.games
              .find({ selector: { _id: { $in: missingIds } } })
              .exec();
            gameDocs = [...gameDocs, ...extraDocs];
          }
        }

        // Convert to Game instances and populate teams
        const games = await Promise.all(
          gameDocs.map(async (doc: any) => {
            const gameData = doc.toMutableJSON();

            // Populate teams
            let team1 = null;
            let team2 = null;
            if (gameData.team1Id) {
              try {
                team1 = await getTeam(gameData.team1Id);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.warn(
                  `Failed to populate team1 for game ${gameData.id}:`,
                  error,
                );
              }
            }
            if (gameData.team2Id) {
              try {
                team2 = await getTeam(gameData.team2Id);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.warn(
                  `Failed to populate team2 for game ${gameData.id}:`,
                  error,
                );
              }
            }

            return new Game({
              ...gameData,
              team1: team1 || ({} as any),
              team2: team2 || ({} as any),
            } as any);
          }),
        );

        return games;
      } catch (error: any) {
        throw new Error(`Failed to get games: ${error.message}`);
      }
    },
    [database, getTeam],
  );

  return {
    addNewGame,
    addNewGameBatch,
    updateGame,
    deleteGame,
    getGame,
    getGames,
  };
};

export default useGameServiceRxDB;
