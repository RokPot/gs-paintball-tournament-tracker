import DesktopScoreboard from 'components/scoreboard/ui/DesktopScoreboard';
import MobileScoreboard from 'components/scoreboard/ui/MobileScoreboard';
import PageContainer from 'components/shared/PageContainer';
import useTournamentFlow from 'hooks/tournament/useTournamentFlow';
import { useIsResponsive } from 'hooks/ui/useIsResponsive';
import { useCallback, useEffect, useState } from 'react';
import useActiveLeague from 'services/queries/league/useActiveLeague';
import useTimerStore from 'store/TimerStore';

const ScoreboardPage: React.FC = () => {
  const startTimer = useTimerStore((state) => state.startTimer);
  const stopTimer = useTimerStore((state) => state.stopTimer);
  const [isMatchInProgress, setIsMatchInProgress] = useState(false);
  const { setDuration } = useTimerStore();
  const [firstLoad, setFirstLoad] = useState(false);
  const { activeLeague } = useActiveLeague();
  const tournament = activeLeague?.activeTournament;
  const { beginTournament, currentGame } = useTournamentFlow(tournament);

  // Set the initial state
  useEffect(() => {
    if (!currentGame || firstLoad) {
      return;
    }
    setDuration(currentGame.gameTime || 0);
    setFirstLoad(true);
  }, [currentGame, firstLoad, setDuration]);

  const startStopMatch = useCallback(() => {
    if (isMatchInProgress) {
      stopTimer();
      setIsMatchInProgress(false);
      return;
    }
    setIsMatchInProgress(true);
    startTimer(100, 300000, false, (hasFinished) => {
      console.log(hasFinished);
    });
  }, [isMatchInProgress]);

  const { isMobile } = useIsResponsive();

  if (isMobile) {
    return (
      <PageContainer padding="0px">
        <MobileScoreboard />
      </PageContainer>
    );
  }

  return (
    <PageContainer padding="0px">
      <DesktopScoreboard
        startStopMatch={startStopMatch}
        isMatchInProgress={isMatchInProgress}
        currentGame={currentGame}
      />
    </PageContainer>
  );
};

export default ScoreboardPage;
