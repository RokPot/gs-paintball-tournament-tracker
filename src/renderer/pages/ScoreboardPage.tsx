import { alpha, css, styled } from '@mui/material';
import DesktopScoreboard from 'components/scoreboard/ui/DesktopScoreboard';
import MobileScoreboard from 'components/scoreboard/ui/MobileScoreboard';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import PageContainer from 'components/shared/PageContainer';
import { useIsResponsive } from 'hooks/ui/useIsResponsive';
import { memo, useCallback, useContext } from 'react';
import { TournamentContext } from 'store/TournamentContext';
import { Match } from 'types/Match';

const StyledLoadingContainer = styled('div')(
  (props) => css`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    padding: 16px 16px;
    overflow: auto;
    z-index: 12;
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    background: ${alpha(props.theme.palette.grey[200], 0.7)};
    transition: all 0.5s ease-in;
  `,
);

interface IProps {}
const ScoreboardPage: React.FC<IProps> = () => {
  const { isMobile } = useIsResponsive();

  const {
    finishMatch,
    beginTournament,
    startStopMatch,
    setFinishMatchModal,
    activeGame,
    timingBreak,
    isMatchInProgress,
    hasGameTimeRanOut,
    showFinishMatchModal,
    isProcessing,
    confirmNextTournamentStage,
    onTeamPause,
    activeLeague,
    isFetchingActiveLeague,
  } = useContext(TournamentContext);

  const tournament = activeLeague?.activeTournament;

  const finishMatchInternal = useCallback(
    async (match: Match) => {
      await finishMatch?.(match);
    },
    [finishMatch],
  );

  if (isMobile) {
    return (
      <PageContainer padding="0px">
        <MobileScoreboard />
      </PageContainer>
    );
  }

  return (
    <PageContainer padding="0px">
      {(isProcessing || isFetchingActiveLeague) && (
        <StyledLoadingContainer>
          <LoadingIndicator height="100%" />
        </StyledLoadingContainer>
      )}
      <DesktopScoreboard
        startStopMatch={() => {
          startStopMatch!();
        }}
        isMatchInProgress={!!isMatchInProgress}
        activeScheduledGame={activeGame}
        hasGameTimeRanOut={!!hasGameTimeRanOut}
        showFinishMatchModal={!!showFinishMatchModal}
        isCurrentlyInCountdown={!!timingBreak}
        isTournamentFinished={!!tournament?.state?.isTournamentFinished}
        setShowFinishMatchModal={setFinishMatchModal!}
        finishMatch={finishMatchInternal}
        onStartTournament={beginTournament!}
        confirmNextTournamentStage={confirmNextTournamentStage!}
        onTeamPause={onTeamPause!}
        isFetchingActiveLeague={isFetchingActiveLeague}
        tournament={tournament}
      />
    </PageContainer>
  );
};

export default memo(ScoreboardPage);
