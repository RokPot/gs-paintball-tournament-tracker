import { useTheme } from '@mui/material';
import CurrentGameView from 'components/results-window/current-game-view/CurrentGameView';
import LeaderboardView from 'components/results-window/LeaderboardView';
import ResultsWindowUpcomingGamesSection from 'components/results-window/ResultsWindowUpcomingGamesSection';
import ResultsScheduleView from 'components/results-window/schedule/ResultsScheduleView';
import FlexContainer from 'components/shared/FlexContainer';
import useIPCRendererMessages from 'hooks/main/useIPCRendererMessages';
import useScrollTo from 'hooks/ui/useScrollTo';
import { useCallback, useEffect, useRef } from 'react';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import { setTimeout } from 'worker-timers';

interface IProps {}

const ResultsPage: React.FC<IProps> = () => {
  const { data: activeLeague, refetch } = LeagueQueries.useActiveLeague();

  const theme = useTheme();

  const scrollRef = useRef<HTMLDivElement>(null);
  const leaderboardScrollRef = useRef<HTMLDivElement>(null);
  const { scrollDivToBottom: scrollScheduleDiv } = useScrollTo(true);
  const { scrollDivToBottom: scrollLeaderboardDiv } = useScrollTo(true);

  const { listenToGameSwitched } = useIPCRendererMessages();
  useEffect(() => {
    listenToGameSwitched(async () => {
      try {
        await refetch();
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

  const SECONDS_BEFORE_SCHEDULE_SCROLL_DELAY = 1000 * 2;
  const SECONDS_FOR_SCHEDULE_SCROLLER = 1000 * 20;

  const SECONDS_BEFORE_LEADERBOARD_SCROLL_DELAY = 1000 * 2;
  const SECONDS_FOR_LEADERBOARD_SCROLLER = 1000 * 25;

  const refreshLeagueAndAnimate = useCallback(async () => {
    const getLeague = async () => {
      await refetch();
    };

    getLeague();

    const startScheduleScroll = () => {
      scrollScheduleDiv(SECONDS_FOR_SCHEDULE_SCROLLER, scrollRef, () => {
        setTimeout(() => {
          startScheduleScroll();
        }, SECONDS_BEFORE_SCHEDULE_SCROLL_DELAY);
      });
    };
    const startLeaderboardScroll = () => {
      scrollLeaderboardDiv(
        SECONDS_FOR_LEADERBOARD_SCROLLER,
        leaderboardScrollRef,
        () => {
          setTimeout(() => {
            startLeaderboardScroll();
          }, SECONDS_BEFORE_LEADERBOARD_SCROLL_DELAY);
        },
      );
    };
    setTimeout(() => {
      startScheduleScroll();
    }, SECONDS_BEFORE_SCHEDULE_SCROLL_DELAY);

    setTimeout(() => {
      startLeaderboardScroll();
    }, SECONDS_BEFORE_LEADERBOARD_SCROLL_DELAY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refreshLeagueAndAnimate();
  }, [refreshLeagueAndAnimate]);

  return (
    <FlexContainer
      flexDirection="column"
      height="100vh"
      alignItems="flex-start"
    >
      <div style={{ width: '100%' }}>
        <CurrentGameView activeLeague={activeLeague} />
      </div>

      <FlexContainer
        flexDirection="row"
        height="100%"
        width="100%"
        style={{ flex: 1, minHeight: 0 }}
      >
        <div
          style={{
            height: '100%',
            maxHeight: '100%',
            width: '100%',
            overflowY: 'hidden',
          }}
          ref={scrollRef}
        >
          <ResultsScheduleView activeLeague={activeLeague} />
        </div>
        <div
          style={{
            height: '100%',
            maxHeight: '100%',
            width: '1200px',
            overflowY: 'hidden',
            borderLeft: `1px solid ${theme.palette.divider}`,
          }}
          ref={leaderboardScrollRef}
        >
          <LeaderboardView activeLeague={activeLeague} />
        </div>
      </FlexContainer>

      <div style={{ flex: '0 0 auto', width: '100%' }}>
        <ResultsWindowUpcomingGamesSection activeLeague={activeLeague} />
      </div>
    </FlexContainer>
  );
};

export default ResultsPage;
