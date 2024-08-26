import { omit } from 'lodash';
import { useCallback, useContext } from 'react';
import { PouchDBContext } from 'store/PouchDBContext';
import { GameDto } from 'types/dto/GameDto';
import { DocType } from 'types/interfaces/IPouchDB';
import { getGamesList } from 'utils/PouchDBUtils';

const useGameService = () => {
  const { database } = useContext(PouchDBContext);

  const addNewGame = useCallback(
    async (game: GameDto) => {
      const res = await database.post(game);
      const newGame = await database.get<GameDto>(res.id);

      return newGame;
    },
    [database],
  );

  const addNewGameBatch = useCallback(
    async (games: GameDto[]) => {
      await database.bulkDocs(games);

      return true;
    },
    [database],
  );

  const updateGame = useCallback(
    async (game: GameDto) => {
      const res = await database.get(game._id);

      const toUpdate = {
        ...res,
        ...omit(game, ['_rev', '_id']),
      };
      await database.put(toUpdate);

      const updatedGame = await database.get<GameDto>(game._id);

      return updatedGame;
    },
    [database],
  );

  const deleteGame = useCallback(
    async (game: GameDto) => {
      const fetchedGame = await database.get<GameDto>(game._id);
      await database.remove(fetchedGame._id, fetchedGame._rev);

      return true;
    },
    [database],
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
      const result = await database.query<GameDto[]>(myMapFunction, {
        include_docs: true,
      });
      const gamesList = getGamesList(result);
      const game = gamesList?.length > 0 ? gamesList[0] : null;
      return game;
    },
    [database],
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
    const result = await database.query<GameDto[]>(myMapFunction, {
      include_docs: true,
    });
    return getGamesList(result);
  }, [database]);

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
