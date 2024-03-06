import LeaderboardView from 'components/results-window/LeaderboardView';
import ScheduleView from 'components/results-window/ScheduleView';
import FlexContainer from 'components/shared/FlexContainer';
import { useEffect, useMemo, useRef, useState } from 'react';
import useActiveLeague from 'services/queries/league/useActiveLeague';
import { setInterval } from 'worker-timers';

interface IProps {}

const ResultsPage: React.FC<IProps> = () => {
  const activeTournament = useActiveLeague();
  const highest = 1;
  const [currentActiveView, setCurentActiveView] = useState(0);
  const timerRef = useRef<number>();

  window.electron.ipcRenderer.on('tournament-updated', (result) => {
    console.log(result);
  });

  const currentActiveElement = useMemo(() => {
    switch (currentActiveView) {
      case 0:
        return <LeaderboardView />;
      case 1:
        return <ScheduleView />;
      default:
        return null;
    }
  }, [currentActiveView]);

  useEffect(() => {
    const secondsBeforeSwitch = 15;
    if (timerRef?.current) {
      clearInterval(timerRef?.current);
    }
    timerRef.current = setInterval(() => {
      setCurentActiveView((curr) => {
        if (curr + 1 > highest) {
          return 0;
        }
        return curr + 1;
      });
    }, secondsBeforeSwitch * 1000);

    return () => clearInterval(timerRef?.current);
  }, []);
  console.log(currentActiveView);
  // todo rokpot transitons, create views
  return (
    <FlexContainer flexDirection="column">{currentActiveElement}</FlexContainer>
  );
};

export default ResultsPage;
