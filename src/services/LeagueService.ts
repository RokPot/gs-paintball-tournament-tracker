import useTeamService from './TeamService';
import usePouchDB, { pouchDbName } from './pouchDB';
import groupBy from 'lodash/groupBy';
import { useCallback } from 'react';
import { League } from 'types/League';
import { Team } from 'types/Team';
import { LeagueDto } from 'types/dto/LeagueDto';

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
            emit(doc._id, { _id: item._id });
          });
        }
      }
    };
    const result = await db.query<LeagueDto>(myMapFunction, {
      include_docs: true,
    });
    console.log(
      result,
      groupBy(result.rows, (row) => row.id)
    );
    const leagues: League[] = [];
    const groupedResults = groupBy(result.rows, (row) => row.id);
    for (const key of Object.keys(groupedResults)) {
      const results = groupedResults[key];
      const rootLeague = results.find((res) => res.value === 'league');
      if (!rootLeague?.doc) {
        return;
      }
      const newLeague: League = new League(rootLeague?.doc);

      const teamss: Team[] = [];
      for (const teamId of rootLeague?.doc?.teamIds || []) {
        const teammm = new Team(await getTeam(teamId._id));
        newLeague.teams.push(teammm);
      }
      leagues.push(newLeague);
    }
    return leagues;
    // const docs = await db.allDocs<LeagueDto>({
    //   include_docs: true,
    //   attachments: true,
    // });
    // // todo rokpot fix types when you figure POUCHDB OUT FFS
    // return docs.rows.map((row) => new League(row.doc || ({} as any)));
  }, []);

  return { addNewLeague, updateLeague, deleteLeague, getLeague, getLeagues };
};

export default useLeagueService;
