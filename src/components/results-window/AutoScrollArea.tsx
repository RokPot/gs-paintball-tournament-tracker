import useScrollTo from 'hooks/ui/useScrollTo';
import { useEffect, useRef } from 'react';
import { clearTimeout, setTimeout } from 'worker-timers';

const OVERFLOW_TOLERANCE_IN_PX = 8;

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

interface IProps {
  scrollDurationInMs: number;
  delayBeforeScrollInMs: number;
  children: React.ReactNode;
}

/**
 * Mount this with a `key` per panel so each panel gets a fresh scroll cycle.
 * Scrolling only starts once the content actually overflows, otherwise a short
 * list would jitter against the bottom of the window.
 */
const AutoScrollArea: React.FC<IProps> = ({
  scrollDurationInMs,
  delayBeforeScrollInMs,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollDivToBottom } = useScrollTo(true);

  // `useScrollTo` returns a fresh function on every render, so hold it in a ref
  // to keep re-renders from cancelling a scroll that is already in flight.
  const scrollDivToBottomRef = useRef(scrollDivToBottom);
  scrollDivToBottomRef.current = scrollDivToBottom;

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    const queue = (callback: () => void) => {
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
        callback();
      }, delayBeforeScrollInMs);
    };

    function run() {
      if (cancelled) {
        return;
      }
      const element = scrollRef.current;
      if (!element) {
        return;
      }
      const overflow = element.scrollHeight - element.clientHeight;
      if (overflow <= OVERFLOW_TOLERANCE_IN_PX) {
        queue(run);
        return;
      }
      scrollDivToBottomRef.current(scrollDurationInMs, scrollRef, () => {
        if (cancelled) {
          return;
        }
        queue(run);
      });
    }

    queue(run);

    return () => {
      cancelled = true;
      safeClearTimeout(timeoutId);
    };
  }, [scrollDurationInMs, delayBeforeScrollInMs]);

  return (
    <div
      ref={scrollRef}
      style={{
        height: '100%',
        maxHeight: '100%',
        width: '100%',
        overflowY: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default AutoScrollArea;
