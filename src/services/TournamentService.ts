import { getTournamentsList } from 'utils/PouchDBUtils';
import { omit } from 'lodash';
import { useCallback } from 'react';
import Tournament from 'types/Tournament';
import { TournamentDto } from 'types/dto/TournamentDto';
import usePouchDB, { DocType, pouchDbName } from './pouchDB';

const useTournamentService = () => {
  const db = usePouchDB(pouchDbName);

  const addNewTournament = useCallback(
    async (tournament: TournamentDto) => {
      const res = await db.post(tournament);
      const newTournament = new Tournament({
        ...(await db.get<TournamentDto>(res.id)),
        schedule: [],
      });

      return newTournament;
    },
    [db],
  );

  const updateTournament = useCallback(
    async (tournament: TournamentDto) => {
      const res = await db.get(tournament._id);

      const toUpdate = {
        ...res,
        ...omit(tournament, ['_rev', '_id']),
      };
      await db.put(toUpdate);

      const updatedTournament = new Tournament({
        ...(await db.get<TournamentDto>(tournament._id)),
        schedule: [],
      });

      return updatedTournament;
    },
    [db],
  );

  const deleteTournament = useCallback(
    async (tournament: TournamentDto) => {
      const fetchedTournament = await db.get<TournamentDto>(tournament._id);
      await db.remove(fetchedTournament._id, fetchedTournament._rev);

      return true;
    },
    [db],
  );

  const getTournament = useCallback(
    async (tournamentId: string) => {
      const myMapFunction = (doc: any, emit: any) => {
        if (doc.docType === DocType.Tournament) {
          if (tournamentId === doc._id) {
            emit(doc, DocType.Tournament);
            if (doc.teamIds) {
              doc.teamIds.forEach((item: any) => {
                emit(doc._id, { _id: item, type: DocType.Team });
              });
            }
            if (doc.leaderboardTeamIds) {
              doc.leaderboardTeamIds.forEach((item: any) => {
                emit(doc._id, { _id: item, type: DocType.LeaderboardTeam });
              });
            }
            if (doc.groupIds) {
              doc.groupIds.forEach((item: any) => {
                emit(doc._id, { _id: item, type: DocType.Group });
              });
            }
          }
        }
      };
      const result = await db.query<TournamentDto[]>(myMapFunction, {
        include_docs: true,
      });
      const tournamentsList = getTournamentsList(result);
      const tournament =
        tournamentsList?.length > 0 ? tournamentsList[0] : null;
      return tournament;
    },
    [db],
  );

  const getTournaments = useCallback(async () => {
    const myMapFunction = (doc: any, emit: any) => {
      if (doc.docType === DocType.Tournament) {
        emit(doc, DocType.Tournament);
        if (doc.teamIds) {
          doc.teamIds.forEach((item: any) => {
            emit(doc._id, { _id: item, type: DocType.Team });
          });
        }
      }
    };
    const result = await db.query<TournamentDto[]>(myMapFunction, {
      include_docs: true,
    });

    return getTournamentsList(result);
  }, [db]);

  return {
    addNewTournament,
    updateTournament,
    deleteTournament,
    getTournament,
    getTournaments,
  };
};

export default useTournamentService;
