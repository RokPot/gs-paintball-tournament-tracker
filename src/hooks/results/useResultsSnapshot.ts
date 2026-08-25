import useIPCRendererMessages from 'hooks/main/useIPCRendererMessages';
import { useEffect, useState } from 'react';
import League from 'types/League';
import { hydrateResultsSnapshot } from 'utils/resultsSnapshotUtils';

/**
 * The results window renders whatever the operator last pushed. It never
 * queries the database itself, which is what used to leave two renderers
 * fighting over the same IndexedDB connection.
 */
const useResultsSnapshot = () => {
  const [activeLeague, setActiveLeague] = useState<League | null>(null);
  const { listenToResultsSnapshot, requestResultsSnapshot } =
    useIPCRendererMessages();

  useEffect(() => {
    const unsubscribe = listenToResultsSnapshot((snapshot) => {
      setActiveLeague(hydrateResultsSnapshot(snapshot));
    });

    // This window can be opened mid-tournament, so ask for the current state
    // instead of waiting for the next change.
    requestResultsSnapshot();

    return unsubscribe;
  }, [listenToResultsSnapshot, requestResultsSnapshot]);

  return activeLeague;
};

export default useResultsSnapshot;
