import usePouchDB, { pouchDbName } from './pouchDB';
import { useCallback } from 'react';
import { Team } from 'types/Team';

const useTeamService = () => {
  const db = usePouchDB(pouchDbName);

  const addNewTeam = useCallback(async (team: Team) => {
    await db.post(team.toDto());
    return await db.get<Team>(team._id);
  }, []);
  const updateTeam = useCallback(async (team: Team) => {}, []);
  const deleteTeam = useCallback(async (team: Team) => {}, []);
  const getTeam = useCallback(async (teamId: string) => {
    return await db.get<Team>(teamId, {
      attachments: true,
    });
  }, []);
  const getTeams = useCallback(async () => {
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
