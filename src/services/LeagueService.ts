import useTeamService from './TeamService';
import usePouchDB, { DocType, pouchDbName } from './pouchDB';
import { omit } from 'lodash';
import { useCallback } from 'react';
import { League } from 'types/League';
import { LeagueDto } from 'types/dto/LeagueDto';
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
    try {
      const res = await db.get(league._id);

      const toUpdate = { ...res, ...omit(league.toDto(), ['_rev', '_id']) };
      await db.put(toUpdate);

      return await db.get<LeagueDto>(league._id);
    } catch (e) {
      console.log(e);
    }
  }, []);
  const deleteLeague = useCallback(async (league: League) => {
    try {
      const resultLeague = await db.get<League>(league._id);
      await db.remove(resultLeague._id, resultLeague._rev);
      return true;
    } catch {
      return false;
    }
  }, []);
  const getLeague = useCallback(async (leagueId: string) => {
    if (!leagueId) {
      return null;
    }
    return new League(await db.get<LeagueDto>(leagueId));
  }, []);
  const getActiveLeague = useCallback(async () => {
    const myMapFunction = (doc: any, emit: any) => {
      if (doc.docType === DocType.League && doc.isLeagueSelected) {
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
    const leagues = getLeaguesList(result);
    return !!leagues?.length ? leagues[0] : undefined;
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

  return {
    addNewLeague,
    updateLeague,
    deleteLeague,
    getLeague,
    getLeagues,
    getActiveLeague,
  };
};

export default useLeagueService;
