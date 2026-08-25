import { useEffect, useMemo, useRef, useState } from 'react';
import { clearTimeout, setTimeout } from 'worker-timers';

export interface RotatingPanelItem {
  key: string;
  title: string;
  durationInMs: number;
  /** How long the panel sits still before the auto-scroll starts. */
  scrollDelayInMs?: number;
  enabled: boolean;
  node: React.ReactNode;
}

const safeClearTimeout = (timeoutId?: number) => {
  if (timeoutId === undefined) {
    return;
  }
  try {
    clearTimeout(timeoutId);
  } catch {
    // worker-timers throws when the timeout has already elapsed.
  }
};

/**
 * Cycles through the enabled panels, holding each for its own duration. A
 * single panel never rotates, so a one-panel stage stays put instead of
 * fading in and out for no reason.
 */
const useRotatingPanel = (panels: RotatingPanelItem[]) => {
  const enabledPanels = useMemo(
    () => panels.filter((panel) => panel.enabled),
    [panels],
  );
  const [activeKey, setActiveKey] = useState<string | undefined>(
    enabledPanels[0]?.key,
  );

  const activeIndex = useMemo(() => {
    const index = enabledPanels.findIndex((panel) => panel.key === activeKey);
    return index === -1 ? 0 : index;
  }, [enabledPanels, activeKey]);

  const activePanel = enabledPanels[activeIndex];

  // Read the panel list through a ref so that refreshing tournament data does
  // not restart the rotation timer and strand the viewer on one panel.
  const panelsRef = useRef(enabledPanels);
  panelsRef.current = enabledPanels;

  const panelCount = enabledPanels.length;
  const activeDurationInMs = activePanel?.durationInMs;

  useEffect(() => {
    if (panelCount <= 1 || activeDurationInMs === undefined) {
      return undefined;
    }
    const timeoutId = setTimeout(() => {
      const currentPanels = panelsRef.current;
      const currentIndex = currentPanels.findIndex(
        (panel) => panel.key === activeKey,
      );
      const nextPanel =
        currentPanels[(Math.max(currentIndex, 0) + 1) % currentPanels.length];
      if (nextPanel) {
        setActiveKey(nextPanel.key);
      }
    }, activeDurationInMs);

    return () => safeClearTimeout(timeoutId);
  }, [panelCount, activeDurationInMs, activeKey]);

  useEffect(() => {
    if (activeKey !== activePanel?.key) {
      setActiveKey(activePanel?.key);
    }
  }, [activeKey, activePanel?.key]);

  return { enabledPanels, activePanel, activeIndex };
};

export default useRotatingPanel;
