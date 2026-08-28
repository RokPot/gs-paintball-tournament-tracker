import { useEffect, useState } from 'react';
import useLeagueServiceRxDB from 'services/LeagueServiceRxDB';
import { useRxDB } from 'store/RxDBContext';
import League from 'types/League';
import { ObservableResult } from './observableTypes';

/**
 * Hook to reactively observe a league using RxDB observables.
 * Re-populates related teams, tournaments, and leaderboard when the league document changes.
 */
const useLeagueObservable = (
  leagueId: string | null | undefined,
): ObservableResult<League> => {
  const { database } = useRxDB();
  const { getLeague } = useLeagueServiceRxDB();
  const [data, setData] = useState<League | null>(null);
  const [isLoading, setIsLoading] = useState(!!leagueId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!leagueId || !database) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return undefined;
    }

    setIsLoading(true);

    const subscription = database.collections.leagues
      .findOne({ selector: { _id: leagueId } })
      .$.subscribe(async (leagueDoc: any) => {
        if (!leagueDoc) {
          setData(null);
          setIsLoading(false);
          setError(null);
          return;
        }

        try {
          const leagueData = await getLeague(leagueId);
          setData(leagueData);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setData(null);
        } finally {
          setIsLoading(false);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [leagueId, database, getLeague]);

  return {
    data: leagueId ? data : null,
    isLoading: leagueId ? isLoading : false,
    error: leagueId ? error : null,
  };
};

export default useLeagueObservable;
