import useTeamService from './TeamService';
import usePouchDB, { DocType, pouchDbName } from './pouchDB';
import groupBy from 'lodash/groupBy';
import { useCallback } from 'react';
import { League } from 'types/League';
import { LeagueDto } from 'types/dto/LeagueDto';
import {
  getRootElementAndLinkedDocs,
  mapLeaderboardTeamsFromResponse,
  mapTeamsFromResponse,
  mapTournamentsFromResponse,
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
      }
    };
    const result = await db.query(myMapFunction, {
      include_docs: true,
    });

    const leagues: League[] = [];
    const groupedResults = groupBy(result.rows, (row) => row.id);
    for (const key of Object.keys(groupedResults)) {
      const { rootDoc, otherDocs } = getRootElementAndLinkedDocs<LeagueDto>(
        groupedResults[key],
        DocType.League
      );

      const rootLeague = rootDoc;
      if (!rootLeague) {
        return;
      }
      const newLeague: League = new League(rootLeague);

      const teams = mapTeamsFromResponse(
        rootLeague?.teamIds,
        otherDocs.filter((val) => val.value.type === DocType.Team)
      );
      const leaderboardTeams = mapLeaderboardTeamsFromResponse(
        rootLeague?.leaderboardTeamIds,
        teams,
        otherDocs.filter((val) => val.value.type === DocType.LeaderboardTeam)
      );
      const tournaments = mapTournamentsFromResponse(
        rootLeague?.leaderboardTeamIds,
        teams,
        otherDocs.filter((val) => val.value.type === DocType.Tournament)
      );
      newLeague.teams = teams;
      newLeague.leaderboard = leaderboardTeams;
      newLeague.tournaments = tournaments;
      leagues.push(newLeague);
    }
    return leagues;
  }, []);

  return { addNewLeague, updateLeague, deleteLeague, getLeague, getLeagues };
};

export default useLeagueService;
