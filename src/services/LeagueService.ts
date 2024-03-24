import { omit } from 'lodash';
import { useCallback } from 'react';
import League from 'types/League';
import { LeagueDto } from 'types/dto/LeagueDto';
import { getLeaguesList } from 'utils/PouchDBUtils';
import { DocType } from 'types/interfaces/IPouchDB';
import usePouchDB, { pouchDbName } from './pouchDB';

import useTournamentService from './TournamentService';

const useLeagueService = () => {
  const db = usePouchDB(pouchDbName);
  const { getTournament } = useTournamentService();

  const addNewLeague = useCallback(
    async (league: League) => {
      const res = await db.post(league.toDto());
      const newLeague = new League(await db.get(res.id));
      return newLeague;
    },
    [db],
  );

  const updateLeague = useCallback(
    async (league: League) => {
      const res = await db.get(league._id);

      const toUpdate = { ...res, ...omit(league.toDto(), ['_rev', '_id']) };
      await db.put(toUpdate);

      const updatedLeague = new League(await db.get<LeagueDto>(league._id));

      return updatedLeague;
    },
    [db],
  );

  const deleteLeague = useCallback(
    async (league: League) => {
      const resultLeague = await db.get<League>(league._id);
      await db.remove(resultLeague._id, resultLeague._rev);
      return true;
    },
    [db],
  );

  const getLeague = useCallback(
    async (leagueId: string) => {
      if (!leagueId) {
        return null;
      }
      return new League(await db.get<LeagueDto>(leagueId));
    },
    [db],
  );

  const getActiveLeague = useCallback(async () => {
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
      return undefined;
    }

    if (!activeLeague?.activeTournament) {
      return activeLeague;
    }

    const activeTournament = await getTournament(
      activeLeague.activeTournament._id,
    );

    activeLeague.activeTournament = activeTournament || undefined;
    return activeLeague;
  }, [db, getTournament]);

  const getLeagues = useCallback(async () => {
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
  }, [db]);

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
