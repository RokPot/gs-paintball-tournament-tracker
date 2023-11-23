import { omit } from 'lodash';
import { useCallback } from 'react';
import League from 'types/League';
import { LeagueDto } from 'types/dto/LeagueDto';
import { getLeaguesList } from 'utils/PouchDBUtils';
import { useSnackbar } from 'notistack';
import {
  snackbarErrorOptions,
  snackbarSuccessOptions,
} from 'utils/snackbarUtils';
import usePouchDB, { DocType, pouchDbName } from './pouchDB';

import useTournamentService from './TournamentService';

const useLeagueService = () => {
  const db = usePouchDB(pouchDbName);
  const { getTournament } = useTournamentService();
  const { enqueueSnackbar } = useSnackbar();

  const addNewLeague = useCallback(
    async (league: League) => {
      try {
        const res = await db.post(league.toDto());
        const newLeague = new League(await db.get(res.id));
        enqueueSnackbar('League successfully created', snackbarSuccessOptions);
        return newLeague;
      } catch {
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
      }
      return null;
    },
    [db, enqueueSnackbar],
  );

  const updateLeague = useCallback(
    async (
      league: League,
      setActiveTournament?: boolean,
      setActiveLeague?: boolean,
    ) => {
      try {
        const res = await db.get(league._id);

        const toUpdate = { ...res, ...omit(league.toDto(), ['_rev', '_id']) };
        await db.put(toUpdate);

        const updatedLeague = new League(await db.get<LeagueDto>(league._id));
        if (setActiveTournament) {
          enqueueSnackbar('Active tournament was set', snackbarSuccessOptions);
        } else if (setActiveLeague) {
          enqueueSnackbar('Active league was set', snackbarSuccessOptions);
        } else {
          enqueueSnackbar(
            'League successfully updated',
            snackbarSuccessOptions,
          );
        }

        return updatedLeague;
      } catch {
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
      }
      return null;
    },
    [db, enqueueSnackbar],
  );

  const deleteLeague = useCallback(
    async (league: League) => {
      try {
        const resultLeague = await db.get<League>(league._id);
        await db.remove(resultLeague._id, resultLeague._rev);
        enqueueSnackbar('League successfully deleted', snackbarSuccessOptions);
        return true;
      } catch {
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
        return false;
      }
    },
    [db, enqueueSnackbar],
  );

  const getLeague = useCallback(
    async (leagueId: string) => {
      try {
        if (!leagueId) {
          return null;
        }
        return new League(await db.get<LeagueDto>(leagueId));
      } catch {
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
      }
      return null;
    },
    [db, enqueueSnackbar],
  );

  const getActiveLeague = useCallback(async () => {
    try {
      const myMapFunction = (doc: any, emit: any) => {
        if (doc.docType === DocType.League && doc.isLeagueSelected) {
          emit(doc, DocType.League);
          if (doc.teamIds) {
            doc.teamIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.Team });
            });
          }
          if (doc.leaderboardTeamIds) {
            doc.leaderboardTeamIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.LeaderboardTeam });
            });
          }
          if (doc.tournamentIds) {
            doc.tournamentIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.Tournament });
            });
          }
        }
      };
      const result = await db.query(myMapFunction, {
        include_docs: true,
      });
      const leagues = getLeaguesList(result);
      const activeLeague = leagues?.length > 0 ? leagues[0] : null;
      if (!activeLeague) {
        return null;
      }
      if (!activeLeague?.activeTournament) {
        return activeLeague;
      }
      const activeTournament = await getTournament(
        activeLeague.activeTournament._id,
      );
      activeLeague.activeTournament = activeTournament || undefined;
      return activeLeague;
    } catch {
      enqueueSnackbar('Something went wrong', snackbarErrorOptions);
    }
    return null;
  }, [db, enqueueSnackbar, getTournament]);

  const getLeagues = useCallback(async () => {
    try {
      const myMapFunction = (doc: any, emit: any) => {
        if (doc.docType === DocType.League) {
          emit(doc, DocType.League);
          if (doc.teamIds) {
            doc.teamIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.Team });
            });
          }
          if (doc.leaderboardTeamIds) {
            doc.leaderboardTeamIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.LeaderboardTeam });
            });
          }
          if (doc.tournamentIds) {
            doc.tournamentIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.Tournament });
            });
          }
        }
      };
      const result = await db.query(myMapFunction, {
        include_docs: true,
      });

      return getLeaguesList(result);
    } catch {
      enqueueSnackbar('Something went wrong', snackbarErrorOptions);
    }
    return null;
  }, [db, enqueueSnackbar]);

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
