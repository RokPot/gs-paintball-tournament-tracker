import usePouchDB, { DocType, pouchDbName } from './pouchDB';
import { useCallback } from 'react';
import { Tournament } from 'types/Tournament';
import { TournamentDto } from 'types/dto/TournamentDto';
import { getTournamentsList } from 'utils/PouchDBUtils';

const useTournamentService = () => {
  const db = usePouchDB(pouchDbName);

  const addNewTournament = useCallback(async (tournament: TournamentDto) => {
    try {
      const res = await db.post(tournament);
      return new Tournament(await db.get<TournamentDto>(res.id));
    } catch {}
  }, []);
  const updateTournament = useCallback(async (tournament: TournamentDto) => {
    const res = await db.post(tournament);
  }, []);
  const deleteTournament = useCallback(async (tournament: TournamentDto) => {
    // await db.remove(tournament._id);
    return null;
  }, []);
  const getTournament = useCallback((tournament: TournamentDto) => {
    return db.get(tournament._id);
  }, []);
  const getTournaments = useCallback(async (leagueId: string) => {
    const myMapFunction = (doc: any, emit: any) => {
      if (doc.docType === DocType.Tournament) {
        emit(doc, DocType.Tournament);
        if (doc.teamIds) {
          doc.teamIds.forEach(function (item: any) {
            emit(doc._id, { _id: item, type: DocType.Team });
          });
        }
      }
    };
    const result = await db.query<TournamentDto[]>(myMapFunction, {
      include_docs: true,
    });

    return getTournamentsList(result);
  }, []);

  return {
    addNewTournament,
    updateTournament,
    deleteTournament,
    getTournament,
    getTournaments,
  };
};

export default useTournamentService;
