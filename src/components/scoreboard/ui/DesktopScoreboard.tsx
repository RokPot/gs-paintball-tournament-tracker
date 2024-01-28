import { Button, Card, Typography, alpha, styled } from '@mui/material';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import { memo, useMemo } from 'react';
import useActiveLeague from 'services/queries/league/useActiveLeague';
import Game from 'types/Game';
import { Match } from 'types/Match';
import { TournamentStatus } from 'types/TournamentStatus';
import BreakTimerStoreRenderComponent from '../BreakTimerStoreRenderComponent';
import GameTimerStoreRenderComponent from '../GameTimerStoreRenderComponent';
import TeamScoreCard from '../TeamScoreCard';
import FinishMatch from './FinishMatch';
import StartTournament from './StartTournament';

interface IProps {
  className?: string;
  isMatchInProgress: boolean;
  currentGame?: Game;
  hasGameTimeRanOut: boolean;
  showFinishMatchPopup: boolean;
  isCurrentlyInCountdown: boolean;
  beginTournament: () => Promise<void>;
  startStopMatch: () => void;
  finishMatch: (match: Match) => Promise<void>;
  setShowFinishMatchPopup: (showFinishPopup: boolean) => void;
}

const DesktopScoreboard: React.FC<IProps> = ({
  className,
  isMatchInProgress,
  currentGame,
  hasGameTimeRanOut,
  showFinishMatchPopup,
  beginTournament,
  startStopMatch,
  finishMatch,
  setShowFinishMatchPopup,
  isCurrentlyInCountdown,
}) => {
  const { activeLeague, isFetchingActiveLeague } = useActiveLeague();
  const tournament = useMemo(
    () => activeLeague?.activeTournament,
    [activeLeague?.activeTournament],
  );

  const isTournamentNotStartedYet = ![
    TournamentStatus.inProgress,
    TournamentStatus.finished,
  ].includes(tournament?.state?.status || TournamentStatus.created);
  console.log(hasGameTimeRanOut, currentGame);

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
              <Button variant="contained" fullWidth size="large">
                <Typography variant="p1Medium">Team 1 Pause</Typography>
              </Button>
            </FlexContainer>
            <FlexContainer flexDirection="column" gap={8}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                onClick={() => setShowFinishMatchPopup(true)}
                disabled={!isMatchInProgress || isCurrentlyInCountdown}
              >
                <Typography variant="h3Medium">Finish Match</Typography>
              </Button>
              <Button
                variant="contained"
                size="large"
                color="primary"
                fullWidth
                onClick={startStopMatch}
              >
                <Typography variant="h3Medium">
                  {isMatchInProgress ? 'Pause Game' : 'Start Game'}
                </Typography>
              </Button>
            </FlexContainer>
            <FlexContainer flexDirection="column" gap={8}>
              <Button variant="contained" size="large">
                <Typography variant="p1Medium">Team 2 Pause</Typography>
              </Button>
            </FlexContainer>
          </FlexContainer>
        </Card>
      </FlexContainer>
      <CustomModal
        isModalOpen={showFinishMatchPopup}
        onClose={() => {
          if (hasGameTimeRanOut) {
            return;
          }
          setShowFinishMatchPopup(false);
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
      <CustomModal
        isModalOpen={isTournamentNotStartedYet && !isFetchingActiveLeague}
        width={600}
      >
        <StartTournament
          onTournamentStart={async () => {
            await beginTournament();
          }}
        />
      </CustomModal>
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
