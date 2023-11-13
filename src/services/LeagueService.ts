import useTeamService from './TeamService';
import usePouchDB, { DocType, pouchDbName } from './pouchDB';
import { omit } from 'lodash';
import { useCallback } from 'react';
import { League } from 'types/League';
import { getLeaguesList } from 'utils/PouchDBUtils';

const useLeagueService = () => {
  const db = usePouchDB(pouchDbName);
  const { getTeam } = useTeamService();

  const addNewLeague = useCallback(async (league: League) => {
    try {
      const res = await db.post(league.toDto());
    } catch {}
  }, []);
  const updateLeague = useCallback(async (league: League) => {
    // console.log(omit(league.toDto(), ['_rev']));
    // const res = await db.put(omit(league.toDto(), ['_rev']), {});
    const res = await db.get(league._id);
    console.log(omit(league.toDto(), ['_rev', '_id']));
    console.log(omit(league.toDto(), ['_id']));
    const toUpdate = { ...res, ...omit(league.toDto(), ['_rev', '_id']) };
    const res1 = await db.put(toUpdate);
    console.log(res1);
    const res3 = await db.get(league._id);
    console.log(res3);
  }, []);
  const deleteLeague = useCallback(async (league: League) => {
    // await db.remove(league._id);
  }, []);
  const getLeague = useCallback((league: League) => {
    return db.get(league._id);
  }, []);
  const getLeagues = useCallback(async () => {
    const myMapFunction = (doc: any, emit: any) => {
      if (doc.docType === DocType.League) {
        emit(doc, DocType.League);
        if (doc.teamIds) {
          doc.teamIds.forEach(function (item: any) {
            emit(doc._id, { _id: item, type: DocType.Team });
          });
        }
        if (doc.leaderboardTeamIds) {
          doc.leaderboardTeamIds.forEach(function (item: any) {
            emit(doc._id, { _id: item, type: DocType.LeaderboardTeam });
          });
        }
        if (doc.tournamentIds) {
          doc.tournamentIds.forEach(function (item: any) {
            emit(doc._id, { _id: item, type: DocType.Tournament });
          });
        }
      }
    };
    const result = await db.query(myMapFunction, {
      include_docs: true,
    });

    return getLeaguesList(result);
  }, []);

  return { addNewLeague, updateLeague, deleteLeague, getLeague, getLeagues };
};

export default useLeagueService;
