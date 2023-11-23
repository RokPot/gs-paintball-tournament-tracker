import { omit } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import { LeaderboardTeamDto } from 'types/dto/LeaderboardTeamDto';
import { TeamDto } from 'types/dto/TeamDto';
import {
  snackbarErrorOptions,
  snackbarSuccessOptions,
} from 'utils/snackbarUtils';
import usePouchDB, { pouchDbName } from './pouchDB';

const useTeamService = () => {
  const db = usePouchDB(pouchDbName);
  const { enqueueSnackbar } = useSnackbar();

  const getTeam = useCallback(
    async (teamId: string) => {
      try {
        return db.get<Team>(teamId, {
          attachments: true,
        });
      } catch {
        enqueueSnackbar(`Something went wrong`, snackbarErrorOptions);
      }
      return null;
    },
    [db, enqueueSnackbar],
  );

  const addNewTeam = useCallback(
    async (team: Team) => {
      try {
        const res = await db.upsert<TeamDto>(team._id, (doc: any) => {
          if (!doc?.teamName) {
            return omit(team.toDto(), ['_id']);
          }
          return doc;
        });
        const newTeam = new Team(await db.get<TeamDto>(res.id));
        enqueueSnackbar('Team successfully added', snackbarSuccessOptions);

        return newTeam;
      } catch {
        enqueueSnackbar(`Something went wrong`, snackbarErrorOptions);
      }
      return null;
    },
    [db, enqueueSnackbar],
  );

  const addNewLeaderBoardTeams = useCallback(
    async (teams: LeaderboardTeam[]) => {
      try {
        const res = await db.bulkDocs([...teams.map((team) => team.toDto())]);
        return res;
      } catch {
        enqueueSnackbar(`Something went wrong`, snackbarErrorOptions);
      }
      return null;
    },
    [db, enqueueSnackbar],
  );

  const addNewLeaderBoardTeam = useCallback(
    async (leaderboardTeam: LeaderboardTeam) => {
      try {
        await db.post(leaderboardTeam.toDto());
        const team = await getTeam(leaderboardTeam.team._id);
        if (!team) {
          return null;
        }
        const freshLeaderboardTeam = await db.get<LeaderboardTeamDto>(
          leaderboardTeam._id,
        );

        return new LeaderboardTeam({ ...freshLeaderboardTeam, team });
      } catch {
        enqueueSnackbar(`Something went wrong`, snackbarErrorOptions);
      }
      return null;
    },
    [db, getTeam, enqueueSnackbar],
  );

  const updateTeam = useCallback(
    async (team: Team) => {
      try {
        const res = await db.get(team._id);
        const toUpdate = { ...res, ...omit(team.toDto(), ['_rev', '_id']) };
        await db.put(toUpdate);
        const updatedTeam = new Team({ ...(await db.get<TeamDto>(team._id)) });
        enqueueSnackbar('Team successfully updated', snackbarSuccessOptions);

        return updatedTeam;
      } catch {
        enqueueSnackbar(`Something went wrong`, snackbarErrorOptions);
      }
      return null;
    },
    [db, enqueueSnackbar],
  );
  const deleteTeam = useCallback(
    async (team: Team) => {
      const res = await db.get<Team>(team._id);
      try {
        await db.remove({ _id: res._id, _rev: res._rev });
        enqueueSnackbar('Team successfully deleted', snackbarSuccessOptions);
        return true;
      } catch {
        enqueueSnackbar(`Something went wrong`, snackbarErrorOptions);

        return false;
      }
    },
    [db, enqueueSnackbar],
  );

  const getTeams = useCallback(async () => {
    try {
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
    } catch {
      enqueueSnackbar(
        `Something went wrong while fetching teams`,
        snackbarErrorOptions,
      );
    }
    return null;
  }, [db, enqueueSnackbar]);

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
