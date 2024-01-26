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
  const [hasGameTimeRanOut, setHasGameTimeRanOut] = useState(false);
  const [showFinishMatchPopup, setShowFinishMatchPopup] = useState(false);
  const { isMobile } = useIsResponsive();

  const { setDuration, getDuration } = useTimerStore();
  const [firstLoad, setFirstLoad] = useState(false);
  const { activeLeague } = useActiveLeague();
  const tournament = activeLeague?.activeTournament;
  const { beginTournament, currentGame, finishMatch } =
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
    startTimer(100, currentGame?.gameTime!, false, (hasFinished) => {
      setHasGameTimeRanOut(hasFinished);
      setShowFinishMatchPopup(hasFinished);
    });
  }, [currentGame?.gameTime, isMatchInProgress, startTimer, stopTimer]);

  // Set the initial state
  useEffect(() => {
    if (!currentGame || firstLoad) {
      return;
    }
    setDuration(currentGame.gameTime || 0);
    setFirstLoad(true);
  }, [currentGame, firstLoad, setDuration]);

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
        beginTournament={beginTournament}
        finishMatch={finishMatchInternal}
        hasGameTimeRanOut={hasGameTimeRanOut}
        setShowFinishMatchPopup={setFinishMatchModal}
        showFinishMatchPopup={showFinishMatchPopup}
      />
    </PageContainer>
  );
};

export default ScoreboardPage;
