import DesktopScoreboard from 'components/scoreboard/ui/DesktopScoreboard';
import PageContainer from 'components/shared/PageContainer';
import { useIsResponsive } from 'hooks/ui/useIsResponsive';
import { useCallback, useState } from 'react';
import useTimerStore from 'store/ScoreboardStore';

const ScoreboardPage: React.FC<{ className?: string }> = ({ className }) => {
  const startTimer = useTimerStore((state) => state.startTimer);
  const stopTimer = useTimerStore((state) => state.stopTimer);
  const [isMatchInProgress, setIsMatchInProgress] = useState(false);

  const startStopMatch = useCallback(() => {
    if (isMatchInProgress) {
      stopTimer();
      setIsMatchInProgress(false);
      return;
    }
    setIsMatchInProgress(true);
    startTimer(100, 300000);
  }, [isMatchInProgress]);

  const { isMobile } = useIsResponsive();

  // if (isMobile) {
  //   return (
  //     <PageContainer padding="0px">
  //       <MobileScoreboard />
  //     </PageContainer>
  //   );
  // }

  return (
    <PageContainer padding="0px">
      <DesktopScoreboard startStopMatch={startStopMatch} />
    </PageContainer>
  );
};

export default ScoreboardPage;
