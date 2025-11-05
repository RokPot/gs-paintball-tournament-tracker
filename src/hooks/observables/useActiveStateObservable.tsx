import { useEffect, useState } from 'react';
import { useRxDB } from 'store/RxDBContext';
import { IActiveState } from 'types/interfaces/IActiveState';

/**
 * Hook to reactively observe the active state using RxDB observables
 *
 * This hook automatically updates when:
 * - The active state document changes (leagueId, tournamentId, or gameId)
 *
 * The active state is stored as a singleton document with _id: "active-state"
 *
 * @returns ActiveState object with leagueId, tournamentId, and gameId, or null if not initialized
 *
 * @example
 * ```tsx
 * const activeState = useActiveStateObservable();
 * // activeState automatically updates when any active ID changes
 * ```
 */
const useActiveStateObservable = (): IActiveState | null => {
  const { database } = useRxDB();
  const [activeState, setActiveState] = useState<IActiveState | null>(null);

  useEffect(() => {
    if (!database) {
      setActiveState(null);
      return undefined;
    }

    const ACTIVE_STATE_ID = 'active-state';

    // Subscribe to active state document changes
    // The $ property creates an observable that emits whenever the document changes
    const subscription = database.collections.activeState
      .findOne({ selector: { _id: ACTIVE_STATE_ID } })
      .$.subscribe((activeStateDoc) => {
        if (!activeStateDoc) {
          setActiveState(null);
          return;
        }

        try {
          const activeStateData = activeStateDoc.toMutableJSON();
          setActiveState(activeStateData);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to get active state in observable:', error);
          setActiveState(null);
        }
      });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [database]);

  return activeState;
};

export default useActiveStateObservable;
