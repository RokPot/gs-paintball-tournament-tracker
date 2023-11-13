import usePouchDB, { pouchDbName } from './pouchDB';
import { useCallback } from 'react';
import { LeaderboardTeam } from 'types/LeadeboardTeam';
import { Team } from 'types/Team';
import { TeamDto } from 'types/dto/TeamDto';

const useTeamService = () => {
  const db = usePouchDB(pouchDbName);

  const addNewTeam = useCallback(async (team: Team) => {
    await db.post(team.toDto());
    return await db.get<Team>(team._id);
  }, []);

  const addNewLeaderBoardTeam = useCallback(
    async (teams: LeaderboardTeam[]) => {
      const res = await db.bulkDocs([...teams.map((team) => team.toDto())]);
      return null;
    },
    []
  );

  const updateTeam = useCallback(async (team: Team) => {}, []);
  const deleteTeam = useCallback(async (team: Team) => {
    const res = await db.get<Team>(team._id);
    try {
      await db.remove({ _id: res._id, _rev: res._rev });
      return true;
    } catch {
      return false;
    }
  }, []);
  const getTeam = useCallback(async (teamId: string) => {
    return await db.get<Team>(teamId, {
      attachments: true,
    });
  }, []);
  const getTeams = useCallback(async () => {
    const myMapFunction = (doc: any, emit: any) => {
      if (doc.docType === 'team') {
        emit(doc);
      }
    };
    const result = await db.query<TeamDto>(myMapFunction, {
      include_docs: true,
    });
    return result.rows.map((row) => new Team(row.doc!)) || [];
  }, []);

  return {
    addNewTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    getTeams,
    addNewLeaderBoardTeam,
  };
};

export default useTeamService;
