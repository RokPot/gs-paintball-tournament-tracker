import LeaderboardView from 'components/results-window/LeaderboardView';
import ScheduleView from 'components/results-window/ScheduleView';
import CurrentGameView from 'components/results-window/current-game-view/CurrentGameView';
import FlexContainer from 'components/shared/FlexContainer';
import ScheduleUpcomingGames from 'components/tournament/visualizations/schedule/ScheduleUpcomingGames';
import useIPCRendererMessages from 'hooks/main/useIPCRendererMessages';
import useScrollTo from 'hooks/ui/useScrollTo';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import { setTimeout } from 'worker-timers';

interface IProps {}

const ResultsPage: React.FC<IProps> = () => {
  const { data: activeLeague, refetch } = LeagueQueries.useActiveLeague();
  const highest = 1;
  const [currentActiveView, setCurentActiveView] = useState(0);
  const [
    currentActiveViewAnimationProgress,
    setCurrentActiveViewAnimationProgress,
  ] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollDivToBottom } = useScrollTo();

  const { listenToGameSwitched } = useIPCRendererMessages();
  useEffect(() => {
    listenToGameSwitched(() => {
      refetch();
    });
  }, []);

  const currentActiveElement = useMemo(() => {
    switch (currentActiveView) {
      case 0:
        return <LeaderboardView activeLeague={activeLeague} />;
      case 1:
        return <ScheduleView activeLeague={activeLeague} />;
      default:
        return null;
    }
  }, [activeLeague, currentActiveView]);

  const setNewActiveViewAndAnimate = useCallback(() => {
    setCurentActiveView((curr) => {
      if (curr + 1 > highest) {
        return 0;
      }
      return curr + 1;
    });
    const startScrollingAfterSeconds = 1000 * 2;
    setTimeout(() => {
      const scrollToBottomInSeconds = 1000 * 15;
      scrollDivToBottom(scrollToBottomInSeconds, scrollRef, () => {
        setTimeout(() => {
          setCurrentActiveViewAnimationProgress(false);
        }, startScrollingAfterSeconds);
      });
    }, startScrollingAfterSeconds);
  }, []);

  useEffect(() => {
    const getLeague = async () => {
      await refetch();
      setNewActiveViewAndAnimate();
    };

    getLeague();
  }, [refetch, setNewActiveViewAndAnimate]);

  useEffect(() => {
    const getLeague = async () => {
      await refetch();
      setCurrentActiveViewAnimationProgress(true);
      setNewActiveViewAndAnimate();
    };
    if (!currentActiveViewAnimationProgress) {
      getLeague();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActiveViewAnimationProgress]);
  return (
    <FlexContainer flexDirection="column" height="100%" alignItems="flex-start">
      <CurrentGameView activeLeague={activeLeague} />
      <div
        style={{
          height: '100%',
          maxHeight: '100%',
          width: '100%',
          overflowY: 'hidden',
        }}
        ref={scrollRef}
      >
        {currentActiveElement}
      </div>

      <ScheduleUpcomingGames
        activeLeague={activeLeague}
        disableNewWindowOpen
        style={{
          marginLeft: '0px',
          marginBottom: '0px',
          marginRight: '0px',
          width: '100%',
          fontSize: '23px',
          height: '80px',
        }}
        fontSize={23}
      />
    </FlexContainer>
  );
};

export default ResultsPage;
