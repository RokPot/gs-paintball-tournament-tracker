import DesktopScoreboard from 'components/scoreboard/ui/DesktopScoreboard';
import MobileScoreboard from 'components/scoreboard/ui/MobileScoreboard';
import PageContainer from 'components/shared/PageContainer';
import useTournamentFlow from 'hooks/tournament/useTournamentFlow';
import { useIsResponsive } from 'hooks/ui/useIsResponsive';
import { useCallback, useEffect, useState } from 'react';
import useActiveLeague from 'services/queries/league/useActiveLeague';
import useTimerStore from 'store/TimerStore';
import { Match } from 'types/Match';

const ScoreboardPage: React.FC = () => {
  const startTimer = useTimerStore((state) => state.startTimer);
  const stopTimer = useTimerStore((state) => state.stopTimer);
  const [isMatchInProgress, setIsMatchInProgress] = useState(false);
  console.log('isMatchInProgress', isMatchInProgress);
  const [hasGameTimeRanOut, setHasGameTimeRanOut] = useState(false);
  const [showFinishMatchPopup, setShowFinishMatchPopup] = useState(false);
  const { isMobile } = useIsResponsive();
  const {
    setDuration,
    setBreakDuration,
    getDuration,
    timingBreak,
    timingGame,
  } = useTimerStore();
  const [firstLoad, setFirstLoad] = useState(false);
  const { activeLeague } = useActiveLeague();
  const tournament = activeLeague?.activeTournament;
  const { beginTournament, activeGame, finishMatch } =
    useTournamentFlow(tournament);
  const setFinishMatchModal = useCallback(
    (shouldShowFinishMatchModal: boolean) => {
      stopTimer();
      setShowFinishMatchPopup(shouldShowFinishMatchModal);
    },
    [stopTimer],
  );
  const finishMatchInternal = useCallback(
    async (match: Match) => {
      const { currentDuration, duration } = getDuration();
      match.matchDurationInSeconds = currentDuration;
      await finishMatch(match, duration);
      setShowFinishMatchPopup(false);
      setIsMatchInProgress(false);
    },
    [finishMatch, getDuration],
  );
  const startStopMatch = useCallback(() => {
    if (isMatchInProgress) {
      stopTimer();
      setIsMatchInProgress(false);
      return;
    }
    setIsMatchInProgress(true);
    if (!activeGame || !tournament || isMatchInProgress) {
      return;
    }
    startTimer(100, activeGame.gameTime * 1000, 10000, false, (hasFinished) => {
      setHasGameTimeRanOut(hasFinished);
      setShowFinishMatchPopup(hasFinished);
    });
  }, [activeGame, isMatchInProgress, startTimer, stopTimer, tournament]);

  useEffect(() => {
    setIsMatchInProgress(timingGame);
  }, [timingGame]);

  // Set the initial state
  useEffect(() => {
    if (!activeGame || firstLoad || !tournament || isMatchInProgress) {
      return;
    }
    setDuration(activeGame.gameTime * 1000 || 0);
    setBreakDuration(
      tournament.gameSettings.shortBreakTimeInSeconds * 1000 || 0,
    );
    setFirstLoad(true);
  }, [activeGame, firstLoad, setDuration, isMatchInProgress]);

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
        currentGame={activeGame}
        beginTournament={beginTournament}
        finishMatch={finishMatchInternal}
        hasGameTimeRanOut={hasGameTimeRanOut}
        setShowFinishMatchPopup={setFinishMatchModal}
        showFinishMatchPopup={showFinishMatchPopup}
        isCurrentlyInCountdown={timingBreak}
      />
    </PageContainer>
  );
};

export default ScoreboardPage;
