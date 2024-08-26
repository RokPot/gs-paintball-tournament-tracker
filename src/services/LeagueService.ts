import { omit } from 'lodash';
import { useCallback, useContext } from 'react';
import League from 'types/League';
import { LeagueDto } from 'types/dto/LeagueDto';
import { getLeaguesList } from 'utils/PouchDBUtils';
import { DocType } from 'types/interfaces/IPouchDB';
import { PouchDBContext } from 'store/PouchDBContext';

import useTournamentService from './TournamentService';

const useLeagueService = () => {
  const { database } = useContext(PouchDBContext);
  const { getTournament } = useTournamentService();

  const addNewLeague = useCallback(
    async (league: League) => {
      const res = await database.post(league.toDto());
      const newLeague = new League(await database.get(res.id));
      return newLeague;
    },
    [database],
  );

  const updateLeague = useCallback(
    async (league: League) => {
      const res = await database.get(league._id);

      const toUpdate = { ...res, ...omit(league.toDto(), ['_rev', '_id']) };
      await database.put(toUpdate);

      const updatedLeague = new League(
        await database.get<LeagueDto>(league._id),
      );

      return updatedLeague;
    },
    [database],
  );

  const deleteLeague = useCallback(
    async (league: League) => {
      const resultLeague = await database.get<League>(league._id);
      await database.remove(resultLeague._id, resultLeague._rev);
      return true;
    },
    [database],
  );

  const getLeague = useCallback(
    async (leagueId: string) => {
      if (!leagueId) {
        return null;
      }
      return new League(await database.get<LeagueDto>(leagueId));
    },
    [database],
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
    const result = await database.query(myMapFunction, {
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
  }, [database, getTournament]);

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
    const result = await database.query(myMapFunction, {
      include_docs: true,
    });

    return getLeaguesList(result);
  }, [database]);

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
