import { getTournamentsList } from 'utils/PouchDBUtils';
import { useSnackbar } from 'notistack';
import {
  snackbarErrorOptions,
  snackbarSuccessOptions,
} from 'utils/snackbarUtils';
import { omit } from 'lodash';
import { useCallback } from 'react';
import Tournament from 'types/Tournament';
import { TournamentDto } from 'types/dto/TournamentDto';
import usePouchDB, { DocType, pouchDbName } from './pouchDB';

const useTournamentService = () => {
  const db = usePouchDB(pouchDbName);
  const { enqueueSnackbar } = useSnackbar();

  const addNewTournament = useCallback(
    async (tournament: TournamentDto) => {
      try {
        const res = await db.post(tournament);
        const newTournament = new Tournament(
          await db.get<TournamentDto>(res.id),
        );
        enqueueSnackbar(
          'Tournament successfully created',
          snackbarSuccessOptions,
        );
        return newTournament;
      } catch {
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
      }
      return null;
    },
    [db, enqueueSnackbar],
  );

  const updateTournament = useCallback(
    async (tournament: TournamentDto) => {
      try {
        const res = await db.get(tournament._id);

        const toUpdate = {
          ...res,
          ...omit(tournament, ['_rev', '_id']),
        };
        await db.put(toUpdate);

        const updatedTournament = new Tournament(
          await db.get<TournamentDto>(tournament._id),
        );
        enqueueSnackbar(
          'Tournament successfully updated',
          snackbarSuccessOptions,
        );
        return updatedTournament;
      } catch {
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
      }
      return null;
    },
    [db, enqueueSnackbar],
  );

  const deleteTournament = useCallback(
    async (tournament: TournamentDto) => {
      try {
        const fetchedTournament = await db.get<TournamentDto>(tournament._id);
        await db.remove(fetchedTournament._id, fetchedTournament._rev);
        enqueueSnackbar(
          'Tournament successfully deleted',
          snackbarSuccessOptions,
        );
        return true;
      } catch {
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
        return false;
      }
    },
    [db, enqueueSnackbar],
  );

  const getTournament = useCallback(
    async (tournamentId: string) => {
      try {
        const myMapFunction = (doc: any, emit: any) => {
          if (doc.docType === DocType.Tournament) {
            if (tournamentId === doc._id) {
              emit(doc, DocType.Tournament);
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
            }
          }
        };
        const result = await db.query<TournamentDto[]>(myMapFunction, {
          include_docs: true,
        });
        const tournamentsList = getTournamentsList(result);
        const tournament =
          tournamentsList?.length > 0 ? tournamentsList[0] : null;
        return tournament;
      } catch {
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
      }
      return null;
    },
    [db, enqueueSnackbar],
  );

  const getTournaments = useCallback(async () => {
    try {
      const myMapFunction = (doc: any, emit: any) => {
        if (doc.docType === DocType.Tournament) {
          emit(doc, DocType.Tournament);
          if (doc.teamIds) {
            doc.teamIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.Team });
            });
          }
        }
      };
      const result = await db.query<TournamentDto[]>(myMapFunction, {
        include_docs: true,
      });

      return getTournamentsList(result);
    } catch {
      enqueueSnackbar('Something went wrong', snackbarErrorOptions);
    }
    return null;
  }, [db, enqueueSnackbar]);

  return {
    addNewTournament,
    updateTournament,
    deleteTournament,
    getTournament,
    getTournaments,
  };
};

export default useTournamentService;
