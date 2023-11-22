import { omit } from 'lodash';
import { useCallback } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import { LeaderboardTeamDto } from 'types/dto/LeaderboardTeamDto';
import { TeamDto } from 'types/dto/TeamDto';
import usePouchDB, { pouchDbName } from './pouchDB';

const useTeamService = () => {
  const db = usePouchDB(pouchDbName);

  const getTeam = useCallback(
    async (teamId: string) => {
      return db.get<Team>(teamId, {
        attachments: true,
      });
    },
    [db],
  );

  const addNewTeam = useCallback(
    async (team: Team) => {
      await db.post(team.toDto());
      return new Team(await db.get<TeamDto>(team._id));
    },
    [db],
  );

  const addNewLeaderBoardTeams = useCallback(
    async (teams: LeaderboardTeam[]) => {
      const res = await db.bulkDocs([...teams.map((team) => team.toDto())]);
      return res;
    },
    [db],
  );

  const addNewLeaderBoardTeam = useCallback(
    async (leaderboardTeam: LeaderboardTeam) => {
      try {
        await db.post(leaderboardTeam.toDto());
        const team = await getTeam(leaderboardTeam.team._id);
        const freshLeaderboardTeam = await db.get<LeaderboardTeamDto>(
          leaderboardTeam._id,
        );
        return new LeaderboardTeam({ ...freshLeaderboardTeam, team });
      } catch (e) {
        console.log(e);
      }
      return null;
    },
    [db, getTeam],
  );

  const updateTeam = useCallback(
    async (team: Team) => {
      try {
        const res = await db.get(team._id);
        const toUpdate = { ...res, ...omit(team.toDto(), ['_rev', '_id']) };
        await db.put(toUpdate);
        return await db.get<TeamDto>(team._id);
      } catch (e) {
        console.log(e);
      }
      return null;
    },
    [db],
  );
  const deleteTeam = useCallback(
    async (team: Team) => {
      const res = await db.get<Team>(team._id);
      try {
        await db.remove({ _id: res._id, _rev: res._rev });
        return true;
      } catch {
        return false;
      }
    },
    [db],
  );

  const getTeams = useCallback(async () => {
    const myMapFunction = (doc: any, emit: any) => {
      if (doc.docType === 'team') {
        emit(doc);
      }
    };
    const result = await db.query<TeamDto>(myMapFunction, {
      include_docs: true,
    });

    return (
      result?.rows
        ?.map((row) => new Team(row.doc!))
        .filter((row) => row !== undefined) || []
    );
  }, [db]);

  return {
    addNewTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    getTeams,
    addNewLeaderBoardTeam,
    addNewLeaderBoardTeams,
  };
};

export default useTeamService;
