import useTeamService from './TeamService';
import usePouchDB, { pouchDbName } from './pouchDB';
import groupBy from 'lodash/groupBy';
import { useCallback } from 'react';
import { League } from 'types/League';
import { LeagueDto } from 'types/dto/LeagueDto';
import {
  getRootElementAndLinkedDocs,
  mapLeaderboardTeamsFromResponse,
  mapTeamsFromResponse,
} from 'utils/PouchDBUtils';

const useLeagueService = () => {
  const db = usePouchDB(pouchDbName);
  const { getTeam } = useTeamService();

  const addNewLeague = useCallback(async (league: LeagueDto) => {
    try {
      const res = await db.post(league);
    } catch {}
  }, []);
  const updateLeague = useCallback(async (league: League) => {
    const res = await db.post(league);
  }, []);
  const deleteLeague = useCallback(async (league: League) => {
    // await db.remove(league._id);
  }, []);
  const getLeague = useCallback((league: League) => {
    return db.get(league._id);
  }, []);
  const getLeagues = useCallback(async () => {
    const myMapFunction = (doc: any, emit: any) => {
      if (doc.docType === 'league') {
        emit(doc, 'league');
        if (doc.teamIds) {
          doc.teamIds.forEach(function (item: any) {
            emit(doc._id, { _id: item, type: 'team' });
          });
        }
        if (doc.leaderboardTeamIds) {
          doc.leaderboardTeamIds.forEach(function (item: any) {
            emit(doc._id, { _id: item, type: 'leaderboard' });
          });
        }
      }
    };
    const result = await db.query(myMapFunction, {
      include_docs: true,
    });

    const leagues: League[] = [];
    const groupedResults = groupBy(result.rows, (row) => row.id);
    for (const key of Object.keys(groupedResults)) {
      const { rootDoc, otherDocs } = getRootElementAndLinkedDocs(
        groupedResults[key],
        'league'
      );

      const rootLeague = rootDoc?.doc as LeagueDto;
      if (!rootLeague) {
        return;
      }
      const newLeague: League = new League(rootLeague);

      const teams = mapTeamsFromResponse(
        rootLeague?.teamIds,
        otherDocs.filter((val) => val.value.type === 'team')
      );
      const leaderboardTeams = mapLeaderboardTeamsFromResponse(
        rootLeague?.leaderboardTeamIds,
        teams,
        otherDocs.filter((val) => val.value.type === 'leaderboard')
      );
      newLeague.teams = teams;
      newLeague.leaderboard = leaderboardTeams;
      leagues.push(newLeague);
    }
    return leagues;
  }, []);

  return { addNewLeague, updateLeague, deleteLeague, getLeague, getLeagues };
};

export default useLeagueService;
