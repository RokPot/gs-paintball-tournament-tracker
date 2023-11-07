import usePouchDB from './pouchDB';
import { useCallback } from 'react';
import { League } from 'types/League';
import { LeagueDto } from 'types/dto/LeagueDto';

const useLeagueService = () => {
  const db = usePouchDB('leagues');

  const addNewLeague = useCallback(async (league: LeagueDto) => {
    try {
      const res = await db.post(league);
    } catch {}
  }, []);
  const updateLeague = useCallback(async (league: League) => {
    const res = await db.post(league);
  }, []);
  const deleteLeague = useCallback(async (league: League) => {
    // await db.remove(league._id);
  }, []);
  const getLeague = useCallback((league: League) => {
    return db.get(league._id);
  }, []);
  const getLeagues = useCallback(async () => {
    const docs = await db.allDocs<LeagueDto>({
      include_docs: true,
      attachments: true,
    });
    return docs.rows.map((row) => new League(row.doc!));
  }, []);

  return { addNewLeague, updateLeague, deleteLeague, getLeague, getLeagues };
};

export default useLeagueService;
