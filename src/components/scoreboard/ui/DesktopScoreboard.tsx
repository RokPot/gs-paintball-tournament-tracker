import { Button, Card, Typography, alpha, styled } from '@mui/material';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import { memo } from 'react';
import { Match } from 'types/Match';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import BreakTimerStoreRenderComponent from '../BreakTimerStoreRenderComponent';
import GameTimerStoreRenderComponent from '../GameTimerStoreRenderComponent';
import TeamScoreCard from '../TeamScoreCard';
import FinishMatch from './FinishMatch';
import FinishedTournamentModal from './FinishedTournamentModal';
import StageChangeTournamentModal from './StageChangeTournamentModal';
import StartTournament from './StartTournament';

interface IProps {
  className?: string;
  isMatchInProgress: boolean;
  activeScheduledGame?: TournamentScheduleGame;
  hasGameTimeRanOut: boolean;
  showFinishMatchModal: boolean;
  isCurrentlyInCountdown: boolean;
  isTournamentFinished: boolean;
  tournament?: Tournament;
  isFetchingActiveLeague?: boolean;
  onStartTournament: () => Promise<void>;
  startStopMatch: () => void;
  finishMatch: (match: Match) => Promise<void>;
  setShowFinishMatchModal: (showFinishPopup: boolean) => void;
  confirmNextTournamentStage: (nextStage: TournamentStage) => Promise<void>;
  onTeamPause: (team: Team, isRefereePause?: boolean) => void;
}

const DesktopScoreboard: React.FC<IProps> = ({
  className,
  isMatchInProgress,
  activeScheduledGame,
  isFetchingActiveLeague,
  hasGameTimeRanOut,
  isCurrentlyInCountdown,
  tournament,
  showFinishMatchModal,
  startStopMatch,
  finishMatch,
  setShowFinishMatchModal,
  confirmNextTournamentStage,
  onStartTournament,
  onTeamPause,
}) => {
  const currentGame = activeScheduledGame?.game;

  const isTournamentNotStartedYet = ![
    TournamentStatus.inProgress,
    TournamentStatus.finished,
    TournamentStatus.stageChange,
  ].includes(tournament?.state?.status || TournamentStatus.created);
  const isTournamentFinished =
    tournament?.state?.status === TournamentStatus.finished;

  const showStartTournamentModal =
    isTournamentNotStartedYet && !isFetchingActiveLeague;

  return (
    <FlexContainer
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      height="100%"
      width="100%"
      className={className}
      padding="8px"
      gap={8}
    >
      <FlexContainer
        flex={1}
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        gap={8}
      >
        <TeamScoreCard
          team={currentGame?.team1}
          teamScore={currentGame?.team1Wins}
          disabled={isTournamentFinished}
          onTeamPause={onTeamPause}
        />
        <Card className="custom-card counter-card">
          <FlexContainer
            flexDirection="column"
            width="100%"
            height="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            <FlexContainer
              width="100%"
              flexDirection="column"
              alignItems="center"
            >
              <div className="header">
                <Typography
                  variant="h1Medium"
                  color={(theme) => theme.palette.primary.contrastText}
                  className="header-text"
                >
                  Game time
                </Typography>
              </div>

              <GameTimerStoreRenderComponent />
            </FlexContainer>

            <FlexContainer flexDirection="column" padding="0px 10px 0px 10px">
              <div className="header">
                <Typography
                  variant="h1Medium"
                  color={(theme) => theme.palette.primary.contrastText}
                  className="header-text"
                >
                  Countdown
                </Typography>
              </div>

              <Typography variant="h3Medium" className="break-text">
                <BreakTimerStoreRenderComponent />
              </Typography>
            </FlexContainer>
          </FlexContainer>
        </Card>
        <TeamScoreCard
          team={currentGame?.team2}
          teamScore={currentGame?.team2Wins}
          disabled={isTournamentFinished}
        />
      </FlexContainer>
      <FlexContainer alignItems="flex-start">
        <Card className="custom-card actions-card">
          <FlexContainer
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            gap={8}
            padding="16px"
          >
            <FlexContainer flexDirection="column" gap={8}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={isTournamentFinished}
              >
                <Typography variant="p1Medium">Team 1 Pause</Typography>
              </Button>
            </FlexContainer>
            <FlexContainer flexDirection="column" gap={8}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                onClick={() => setShowFinishMatchModal(true)}
                disabled={
                  !isMatchInProgress ||
                  isCurrentlyInCountdown ||
                  isTournamentFinished
                }
              >
                <Typography variant="h3Medium">Finish Match</Typography>
              </Button>
              <Button
                variant="contained"
                size="large"
                color="primary"
                fullWidth
                onClick={startStopMatch}
                disabled={isTournamentFinished}
              >
                <Typography variant="h3Medium">
                  {isMatchInProgress ? 'Pause Game' : 'Start Game'}
                </Typography>
              </Button>
            </FlexContainer>
            <FlexContainer flexDirection="column" gap={8}>
              <Button
                variant="contained"
                size="large"
                disabled={isTournamentFinished}
              >
                <Typography variant="p1Medium">Team 2 Pause</Typography>
              </Button>
            </FlexContainer>
          </FlexContainer>
        </Card>
      </FlexContainer>
      <CustomModal
        isModalOpen={showFinishMatchModal}
        onClose={() => {
          if (hasGameTimeRanOut) {
            return;
          }
          setShowFinishMatchModal(false);
        }}
        width={600}
        title="Finish Match"
        showHeader
        canClose={!hasGameTimeRanOut}
      >
        <FinishMatch
          game={currentGame}
          sizeOfTeams={tournament?.settings?.numberOfTeamSize}
          shouldInsertTeamsMargins={
            tournament?.settings?.shouldInsertMatchMargins
          }
          onMatchFinished={async (match) => {
            await finishMatch(match);
          }}
          forceInsert={hasGameTimeRanOut}
        />
      </CustomModal>
      <CustomModal isModalOpen={showStartTournamentModal} width={600} canClose>
        <StartTournament
          status={tournament?.state.status}
          tournamentSelected={!!tournament}
          onTournamentStart={async () => {
            await onStartTournament();
          }}
        />
      </CustomModal>
      <StageChangeTournamentModal
        onTournamentContinueStage={confirmNextTournamentStage}
        tournament={tournament}
      />
      <FinishedTournamentModal
        onTournamentContinueStage={() => {}}
        tournament={tournament}
      />
    </FlexContainer>
  );
};

export default styled(memo(DesktopScoreboard))(
  (props) => `
    height: 100%;

    .custom-card {
      box-shadow: ${alpha(props.theme.palette.primary.main, 0.5)} 0px 5px 15px;
      border: solid 1px ${alpha(props.theme.palette.primary.main, 0.2)};
    }

    .counter-card {
      min-width: 200px;
      max-width: 700px;
      width: 100%;
      height: 100%;
      max-height: 500px;
      min-height: 200px;
    }
    .header {
      background: ${props.theme.palette.primary.main};
      width: 100%;
      text-align: center;
      padding: 8px;
      border-radius: 2px 2px 20px 20px;
    }

    .header-text {
      font-size: 40px;
    }

    .break-text {
      font-size: 120px;
      line-height: normal;
    }
    .actions-card {
      height: 150px;
    }

    `,
);
