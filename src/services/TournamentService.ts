import {
  getTournamentActivityList,
  getTournamentsList,
} from 'utils/PouchDBUtils';
import { omit } from 'lodash';
import { useCallback } from 'react';
import Tournament from 'types/Tournament';
import { TournamentDto } from 'types/dto/TournamentDto';
import { DocType } from 'types/interfaces/IPouchDB';
import { TournamentActivityDto } from 'types/dto/TournamentActivityDto';
import usePouchDB, { pouchDbName } from './pouchDB';
import useStageService from './StageService';

const useTournamentService = () => {
  const db = usePouchDB(pouchDbName);
  const { getStages } = useStageService();

  const addNewTournament = useCallback(
    async (tournament: TournamentDto) => {
      const res = await db.post(tournament);
      const newTournament = new Tournament({
        ...(await db.get<TournamentDto>(res.id)),
        stages: [],
      });

      return newTournament;
    },
    [db],
  );

  const updateTournament = useCallback(
    async (tournament: TournamentDto) => {
      const res = await db.get(tournament._id);

      const toUpdate = {
        ...res,
        ...omit(tournament, ['_rev', '_id']),
      };
      await db.put(toUpdate);

      const updatedTournament = new Tournament({
        ...(await db.get<TournamentDto>(tournament._id)),
        stages: [],
      });

      return updatedTournament;
    },
    [db],
  );

  const deleteTournament = useCallback(
    async (tournament: TournamentDto) => {
      const fetchedTournament = await db.get<TournamentDto>(tournament._id);
      await db.remove(fetchedTournament._id, fetchedTournament._rev);

      return true;
    },
    [db],
  );

  const getTournament = useCallback(
    async (tournamentId: string) => {
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
            if (doc.stageIds) {
              doc.stageIds.forEach((item: any) => {
                emit(doc._id, { _id: item, type: DocType.TournamentStage });
              });
            }
          }
        }
      };
      const result = await db.query<TournamentDto[]>(myMapFunction, {
        include_docs: true,
      });
      const tournamentsList = getTournamentsList(result);
      if (tournamentsList?.length < 0) {
        return null;
      }
      const { tournament, stageIds } = tournamentsList[0];

      if (stageIds) {
        const stages = await getStages(stageIds);
        tournament.stages = stages;
      }
      return tournament;
    },
    [db, getStages],
  );

  const getTournaments = useCallback(async () => {
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

    return getTournamentsList(result).map(
      (tournamentResult) => tournamentResult.tournament,
    );
  }, [db]);

  const addNewTournamentActivity = useCallback(
    async (tournamentActivity: TournamentActivityDto) => {
      await db.post(tournamentActivity);
    },
    [db],
  );

  const getTournamentActivity = useCallback(
    async (tournamentId: string) => {
      const myMapFunction = (doc: any, emit: any) => {
        if (doc.docType === DocType.TournamentActivity) {
          if (doc.tournamentId === tournamentId) {
            emit(doc, DocType.TournamentActivity);
            if (doc.gameId) {
              emit(doc._id, { _id: doc.gameId, type: DocType.Game });
            }
          }
        }
      };
      const result = await db.query<TournamentActivityDto[]>(myMapFunction, {
        include_docs: true,
      });

      return getTournamentActivityList(result);
    },
    [db],
  );

  return {
    addNewTournament,
    updateTournament,
    deleteTournament,
    getTournament,
    getTournaments,
    getTournamentActivity,
    addNewTournamentActivity,
  };
};

export default useTournamentService;
