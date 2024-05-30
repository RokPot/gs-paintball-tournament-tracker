import { alpha, css, styled } from '@mui/material';
import DesktopScoreboard from 'components/scoreboard/ui/DesktopScoreboard';
import MobileScoreboard from 'components/scoreboard/ui/MobileScoreboard';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import PageContainer from 'components/shared/PageContainer';
import useTournamentLogic from 'hooks/tournament/useTournamentLogic';
import { useIsResponsive } from 'hooks/ui/useIsResponsive';
import { memo, useCallback } from 'react';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
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

  const { data: activeLeague, isLoading: isFetchingActiveLeague } =
    LeagueQueries.useActiveLeague();

  const tournament = activeLeague?.activeTournament;

  const {
    finishMatch,
    beginTournament,
    startStopMatch,
    setFinishMatchModal,
    activeGame,
    timingBreak,
    isMatchInProgress,
    hasGameTimeRanOut,
    showFinishMatchPopup,
    isProcessing,
    confirmNextTournamentStage,
  } = useTournamentLogic(tournament);

  const finishMatchInternal = useCallback(
    async (match: Match) => {
      await finishMatch(match);
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
          startStopMatch();
        }}
        isMatchInProgress={isMatchInProgress}
        activeScheduledGame={activeGame}
        beginTournament={beginTournament}
        finishMatch={finishMatchInternal}
        hasGameTimeRanOut={hasGameTimeRanOut}
        setShowFinishMatchPopup={setFinishMatchModal}
        showFinishMatchPopup={showFinishMatchPopup}
        isCurrentlyInCountdown={timingBreak}
        isTournamentFinished={!!tournament?.state?.isTournamentFinished}
        confirmNextTournamentStage={confirmNextTournamentStage}
      />
    </PageContainer>
  );
};

export default memo(ScoreboardPage);
