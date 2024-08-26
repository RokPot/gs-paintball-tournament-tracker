import { omit } from 'lodash';
import { useCallback, useContext } from 'react';
import { PouchDBContext } from 'store/PouchDBContext';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import { LeaderboardTeamDto } from 'types/dto/LeaderboardTeamDto';
import { TeamDto } from 'types/dto/TeamDto';

const useTeamService = () => {
  const { database } = useContext(PouchDBContext);

  const getTeam = useCallback(
    async (teamId: string) => {
      return new Team(
        await database.get<TeamDto>(teamId, {
          attachments: true,
        }),
      );
    },
    [database],
  );

  const addNewTeam = useCallback(
    async (team: Team) => {
      const res = await database.upsert<TeamDto>(team._id, (doc: any) => {
        if (!doc?.teamName) {
          return omit(team.toDto(), ['_id']);
        }
        return doc;
      });
      const newTeam = new Team(await database.get<TeamDto>(res.id));

      return newTeam;
    },
    [database],
  );

  const addNewLeaderBoardTeams = useCallback(
    async (teams: LeaderboardTeam[]) => {
      const res = await database.bulkDocs([
        ...teams.map((team) => team.toDto()),
      ]);
      return res;
    },
    [database],
  );

  const addNewLeaderBoardTeam = useCallback(
    async (leaderboardTeam: LeaderboardTeam) => {
      await database.post(leaderboardTeam.toDto());
      const team = await getTeam(leaderboardTeam.team._id);
      if (!team) {
        return null;
      }
      const freshLeaderboardTeam = await database.get<LeaderboardTeamDto>(
        leaderboardTeam._id,
      );

      return new LeaderboardTeam({ ...freshLeaderboardTeam, team });
    },
    [database, getTeam],
  );

  const updateTeam = useCallback(
    async (team: Team) => {
      const res = await database.get(team._id);
      const toUpdate = { ...res, ...omit(team.toDto(), ['_rev', '_id']) };
      await database.put(toUpdate);
      const updatedTeam = new Team({
        ...(await database.get<TeamDto>(team._id)),
      });

      return updatedTeam;
    },
    [database],
  );
  const deleteTeam = useCallback(
    async (team: Team) => {
      const res = await database.get<Team>(team._id);

      await database.remove({ _id: res._id, _rev: res._rev });
    },
    [database],
  );

  const getTeams = useCallback(async () => {
    const myMapFunction = (doc: any, emit: any) => {
      if (doc.docType === 'team') {
        emit(doc);
      }
    };
    const result = await database.query<TeamDto>(myMapFunction, {
      include_docs: true,
    });

    return (
      result?.rows
        ?.map((row) => new Team(row.doc!))
        .filter((row) => row !== undefined) || []
    );
  }, [database]);

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
