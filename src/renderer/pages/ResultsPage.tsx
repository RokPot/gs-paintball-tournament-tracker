import LeaderboardView from 'components/results-window/LeaderboardView';
import ScheduleView from 'components/results-window/ScheduleView';
import FlexContainer from 'components/shared/FlexContainer';
import { useEffect, useMemo, useRef, useState } from 'react';
import useLeagueService from 'services/LeagueService';
import League from 'types/League';
import { setInterval } from 'worker-timers';

interface IProps {}

const ResultsPage: React.FC<IProps> = () => {
  const { getActiveLeague } = useLeagueService();
  const highest = 1;
  const [currentActiveView, setCurentActiveView] = useState(1);
  const [activeLeague, setActiveLeague] = useState<League | null>(null);
  const timerRef = useRef<number>();

  window.electron.ipcRenderer.on('tournament-updated', async (result) => {
    console.log(result);
    const league = await getActiveLeague();
    console.log(league);
  });

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
      const league = await getActiveLeague();
      setActiveLeague(league);
    };

    timerRef.current = setInterval(async () => {
      const league = await getActiveLeague();
      setActiveLeague(league);
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
  console.log(currentActiveView);
  // todo rokpot transitons, create views
  return (
    <FlexContainer flexDirection="column" height="100%" alignItems="flex-start">
      {currentActiveElement}
    </FlexContainer>
  );
};

export default ResultsPage;
