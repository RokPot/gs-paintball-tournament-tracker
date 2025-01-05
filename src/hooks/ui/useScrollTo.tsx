import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useRef } from 'react';

const useScrollTo = (scrollBackUpAfterFinish: boolean) => {
  const startScrollingTop = useRef(false);
  const bottomEndPosition = useRef(0);
  const scrollDivToBottom = (
    timeForScrollingInMs: number,
    scrollElement: React.RefObject<HTMLDivElement>,
    onScrollFinished: () => void,
  ) => {
    const startScrollPos = 0;
    const divElement = scrollElement?.current;

    let scrollDifference = window.innerHeight;
    if (divElement) {
      scrollDifference = divElement.scrollHeight - divElement.clientHeight + 20;
    }

    const starttime = new Date().getTime();
    const scrollController = () => {
      const currenttime = new Date().getTime();
      const timediff = currenttime - starttime;
      const timePercent = timediff / timeForScrollingInMs;
      const scrollToBottomPosition =
        startScrollPos + scrollDifference * timePercent;
      const scrollToTopPosition =
        bottomEndPosition.current - scrollDifference * timePercent;

      scrollElement?.current?.scrollTo({
        top: startScrollingTop?.current
          ? scrollToTopPosition
          : scrollToBottomPosition,
        left: 0,
      });

      if (timePercent < 1) {
        requestAnimationFrame(() => scrollController());
      } else {
        scrollElement?.current?.scrollTo(
          0,
          startScrollingTop?.current ? 0 : startScrollPos + scrollDifference,
        );

        if (scrollBackUpAfterFinish) {
          startScrollingTop.current = !startScrollingTop.current;
          bottomEndPosition.current = startScrollPos + scrollDifference;
        }
        onScrollFinished();
      }
    };

    requestAnimationFrame(() => scrollController());
  };

  const scrollDataGridToBottom = (
    timeForScrollingInMs: number,
    containerHeight: number,
    scrollElement: React.MutableRefObject<GridApiCommunity>,
    onScrollFinished: () => void,
  ) => {
    const startScrollPos = window.scrollY;
    const diff = containerHeight
      ? containerHeight - 40
      : window.innerHeight - 200;
    const starttime = new Date().getTime();

    const scrollController = () => {
      const currenttime = new Date().getTime();
      const timediff = currenttime - starttime;
      const timePercent = timediff / timeForScrollingInMs;
      const scrollto = startScrollPos + diff * timePercent;

      scrollElement?.current?.scroll({
        top: scrollto,
        left: 0,
      });

      if (timePercent < 1) {
        requestAnimationFrame(() => scrollController());
      } else {
        scrollElement?.current?.scroll({ left: 0, top: startScrollPos + diff });
        onScrollFinished();
      }
    };

    requestAnimationFrame(() => scrollController());
  };

  return { scrollDivToBottom, scrollDataGridToBottom };
};

export default useScrollTo;
