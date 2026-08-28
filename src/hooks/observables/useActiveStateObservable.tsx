import { useEffect, useState } from 'react';
import { useRxDB } from 'store/RxDBContext';
import { IActiveState } from 'types/interfaces/IActiveState';
import { ObservableResult } from './observableTypes';

const ACTIVE_STATE_ID = 'active-state';

/**
 * Hook to reactively observe the active state using RxDB observables
 *
 * This hook automatically updates when:
 * - The active state document changes (leagueId, tournamentId, or gameId)
 *
 * The active state is stored as a singleton document with _id: "active-state"
 */
const useActiveStateObservable = (): ObservableResult<IActiveState> => {
  const { database } = useRxDB();
  const [data, setData] = useState<IActiveState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!database) {
      setData(null);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);

    const subscription = database.collections.activeState
      .findOne({ selector: { _id: ACTIVE_STATE_ID } })
      .$.subscribe((activeStateDoc: any) => {
        if (!activeStateDoc) {
          setData(null);
          setIsLoading(false);
          setError(null);
          return;
        }

        try {
          setData(activeStateDoc.toMutableJSON());
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
  }, [database]);

  return { data, isLoading, error };
};

export default useActiveStateObservable;
