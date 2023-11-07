import usePouchDB from './pouchDB';
import { useCallback } from 'react';
import { Team } from 'types/Team';

const useTeamService = () => {
  const db = usePouchDB('teams');

  const addNewTeam = useCallback(async (team: Team) => {
    const res = await db.post(team.toDto());
  }, []);
  const updateTeam = useCallback(async (team: Team) => {}, []);
  const deleteTeam = useCallback(async (team: Team) => {}, []);
  const getTeam = useCallback((teamId: Team) => {}, []);
  const getTeams = useCallback(async () => {
    await db
      .query('_teams/all')
      .then(function (res) {
        // got the query results
        console.log(res);
      })
      .catch(function (err) {
        // some error
        console.log(err);
      });
    const docs = await db.allDocs<Team>({
      include_docs: true,
      attachments: true,
    });
    return docs.rows.map((row) => new Team(row.doc!)) || [];
  }, []);

  return {
    addNewTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    getTeams,
  };
};

export default useTeamService;
