import LeaderboardView from 'components/results-window/LeaderboardView';
import ScheduleView from 'components/results-window/ScheduleView';
import FlexContainer from 'components/shared/FlexContainer';
import ScheduleUpcomingGames from 'components/tournament/visualizations/schedule/ScheduleUpcomingGames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import { setInterval } from 'worker-timers';

interface IProps {}

const ResultsPage: React.FC<IProps> = () => {
  const { data: activeLeague, refetch } = LeagueQueries.useActiveLeague();
  const highest = 1;
  const [currentActiveView, setCurentActiveView] = useState(1);
  const timerRef = useRef<number>();

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

  useEffect(() => {
    const secondsBeforeSwitch = 15;
    if (timerRef?.current) {
      clearInterval(timerRef?.current);
    }

    const getLeague = async () => {
      await refetch();
    };

    timerRef.current = setInterval(async () => {
      await refetch();
      setCurentActiveView((curr) => {
        if (curr + 1 > highest) {
          return 0;
        }
        return curr + 1;
      });
    }, secondsBeforeSwitch * 1000);
    getLeague();
    return () => clearInterval(timerRef?.current);
  }, []);

  return (
    <FlexContainer flexDirection="column" height="100%" alignItems="flex-start">
      {currentActiveElement}
      <ScheduleUpcomingGames
        activeLeague={activeLeague}
        disableNewWindowOpen
        style={{
          marginLeft: '0px',
          marginBottom: '0px',
          marginRight: '0px',
          width: '100%',
        }}
      />
    </FlexContainer>
  );
};

export default ResultsPage;
