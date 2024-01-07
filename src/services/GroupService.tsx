import { omit } from 'lodash';
import { useCallback } from 'react';
import Tournament from 'types/Tournament';
import { TournamentDto } from 'types/dto/TournamentDto';
import { getTournamentsList } from 'utils/PouchDBUtils';
import usePouchDB, { DocType, pouchDbName } from './pouchDB';

const useGroupService = () => {
  const db = usePouchDB(pouchDbName);

  const addNewGroup = useCallback(
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

  const addNewGroupBatch = useCallback(
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

  const updateGroup = useCallback(
    async (tournament: TournamentDto) => {
      const res = await db.get(tournament._id);

      const toUpdate = {
        ...res,
        ...omit(tournament, ['_rev', '_id']),
      };
      console.log(toUpdate, tournament);
      await db.put(toUpdate);

      const updatedTournament = new Tournament({
        ...(await db.get<TournamentDto>(tournament._id)),
        schedule: [],
      });

      return updatedTournament;
    },
    [db],
  );

  const deleteGroup = useCallback(
    async (tournament: TournamentDto) => {
      const fetchedTournament = await db.get<TournamentDto>(tournament._id);
      await db.remove(fetchedTournament._id, fetchedTournament._rev);

      return true;
    },
    [db],
  );

  const getGroup = useCallback(
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

  const getGroups = useCallback(async () => {
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
    addNewGroup,
    addNewGroupBatch,
    updateGroup,
    deleteGroup,
    getGroup,
    getGroups,
  };
};

export default useGroupService;
