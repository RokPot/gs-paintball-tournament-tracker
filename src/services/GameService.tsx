import { omit } from 'lodash';
import { useCallback } from 'react';
import { GameDto } from 'types/dto/GameDto';
import { getGamesList } from 'utils/PouchDBUtils';
import usePouchDB, { DocType, pouchDbName } from './pouchDB';

const useGameService = () => {
  const db = usePouchDB(pouchDbName);

  const addNewGame = useCallback(
    async (game: GameDto) => {
      const res = await db.post(game);
      const newGame = await db.get<GameDto>(res.id);

      return newGame;
    },
    [db],
  );

  const addNewGameBatch = useCallback(
    async (games: GameDto[]) => {
      const res = await db.post(games[0]);
      const newGame = await db.get<GameDto>(res.id);

      return newGame;
    },
    [db],
  );

  const updateGame = useCallback(
    async (game: GameDto) => {
      const res = await db.get(game._id);

      const toUpdate = {
        ...res,
        ...omit(game, ['_rev', '_id']),
      };
      await db.put(toUpdate);

      const updatedGame = await db.get<GameDto>(game._id);

      return updatedGame;
    },
    [db],
  );

  const deleteGame = useCallback(
    async (game: GameDto) => {
      const fetchedGame = await db.get<GameDto>(game._id);
      await db.remove(fetchedGame._id, fetchedGame._rev);

      return true;
    },
    [db],
  );

  const getGame = useCallback(
    async (gameId: string) => {
      const myMapFunction = (doc: any, emit: any) => {
        if (doc.docType === DocType.Game) {
          if (gameId === doc._id) {
            emit(doc, DocType.Game);
            if (doc.team1Id) {
              emit(doc._id, { _id: doc.team1Id, type: DocType.Team });
            }
            if (doc.team2Id) {
              emit(doc._id, { _id: doc.team2Id, type: DocType.Team });
            }
          }
        }
      };
      const result = await db.query<GameDto[]>(myMapFunction, {
        include_docs: true,
      });
      const gamesList = getGamesList(result);
      const game = gamesList?.length > 0 ? gamesList[0] : null;
      return game;
    },
    [db],
  );

  const getGames = useCallback(async () => {
    const myMapFunction = (doc: any, emit: any) => {
      if (doc.docType === DocType.Tournament) {
        emit(doc, DocType.Tournament);
        if (doc.team1Id) {
          emit(doc._id, { _id: doc.team1Id, type: DocType.Team });
        }
        if (doc.team2Id) {
          emit(doc._id, { _id: doc.team2Id, type: DocType.Team });
        }
      }
    };
    const result = await db.query<GameDto[]>(myMapFunction, {
      include_docs: true,
    });
    return getGamesList(result);
  }, [db]);

  return {
    addNewGame,
    addNewGameBatch,
    updateGame,
    deleteGame,
    getGame,
    getGames,
  };
};

export default useGameService;
