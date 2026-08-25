import useIPCRendererMessages from 'hooks/main/useIPCRendererMessages';
import { useCallback, useEffect, useRef } from 'react';
import League from 'types/League';
import { serializeResultsSnapshot } from 'utils/resultsSnapshotUtils';

/**
 * Operator-side only. The results window is a display and must not open
 * IndexedDB of its own, so the operator ships it the league it already has
 * loaded. Purely additive: this never feeds anything back into tournament
 * logic.
 */
const useBroadcastResultsSnapshot = (activeLeague?: League | null) => {
  const {
    sendResultsSnapshot,
    listenToGameSwitched,
    listenToRequestResultsSnapshot,
  } = useIPCRendererMessages();

  // Games are mutated in place during scoring, so hold the live reference and
  // re-serialize on demand rather than caching a snapshot.
  const activeLeagueRef = useRef(activeLeague);
  activeLeagueRef.current = activeLeague;

  const broadcast = useCallback(() => {
    try {
      sendResultsSnapshot(serializeResultsSnapshot(activeLeagueRef.current));
    } catch (e) {
      console.error('Failed to broadcast results snapshot', e);
    }
  }, [sendResultsSnapshot]);

  useEffect(() => {
    broadcast();
  }, [activeLeague, broadcast]);

  // `gamesSwitched` is the existing ping the operator gets back whenever a game
  // boundary is crossed, which covers score changes that mutate in place.
  useEffect(() => {
    return listenToGameSwitched(() => {
      broadcast();
    });
  }, [broadcast, listenToGameSwitched]);

  useEffect(() => {
    return listenToRequestResultsSnapshot(() => {
      broadcast();
    });
  }, [broadcast, listenToRequestResultsSnapshot]);
};

export default useBroadcastResultsSnapshot;
