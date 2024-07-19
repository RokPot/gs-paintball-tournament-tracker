import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconButton,
  Tooltip,
  Typography,
  lighten,
  styled,
  useTheme,
} from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import useIPCRendererMessages from 'hooks/main/useIPCRendererMessages';
import { CSSProperties, useEffect, useState } from 'react';
import { GameState } from 'types/GameState';
import League from 'types/League';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { TournamentStatus } from 'types/TournamentStatus';

interface IProps {
  activeLeague: League | undefined | null;
  style?: CSSProperties;
  disableNewWindowOpen?: boolean;
  fontSize?: number;
}

const StyledFlexContainer = styled(FlexContainer)`
  position: sticky;
  bottom: -16px;
  width: calc(100% + 32px);
  margin: auto -16px -16px -16px;
  background: ${(theme) => lighten(theme.theme?.palette?.primary.light, 0.7)};
  box-shadow: 0 -4px 4px ${(theme) => lighten(theme.theme?.palette?.primary.light, 0.5)};

  height: 50px;
  padding: 8px;
`;

const ScheduleUpcomingGames: React.FC<IProps> = ({
  activeLeague,
  style,
  disableNewWindowOpen,
  fontSize = 14,
}) => {
  const theme = useTheme();

  const { openNewResultsWindow } = useIPCRendererMessages();

  const [upcomingGames, setUpcomingGames] = useState<
    TournamentScheduleGame[][]
  >([]);

  useEffect(() => {
    if (!activeLeague?.activeTournament) {
      return;
    }
    const notFinishedScheduledGames =
      activeLeague?.activeTournament.currentStage?.schedule?.filter(
        (scheduledGame) => scheduledGame.game.gameState === GameState.created,
      ) || [];
    const groupedUpcomingGames: TournamentScheduleGame[][] = [];
    for (let i = 0; i < notFinishedScheduledGames.length; ) {
      if (groupedUpcomingGames.length > 1) {
        break;
      }
      const firstGamePair = notFinishedScheduledGames[i];
      const secondGamePair = notFinishedScheduledGames[i + 1];
      if (firstGamePair?.pairedGameId === secondGamePair?.id) {
        groupedUpcomingGames.push([firstGamePair, secondGamePair]);
        i += 2;
      } else {
        groupedUpcomingGames.push([firstGamePair]);
        i += 1;
      }
    }
    setUpcomingGames(groupedUpcomingGames);
  }, [activeLeague?.activeTournament]);

  if (
    !activeLeague?.activeTournament ||
    activeLeague?.activeTournament.state.isTournamentFinished ||
    activeLeague?.activeTournament.state.status !== TournamentStatus.inProgress
  ) {
    return null;
  }
  return (
    <StyledFlexContainer
      flexDirection="row"
      style={{
        ...style,
      }}
    >
      {upcomingGames.map((upcomingGamePairs, index) => {
        const pairedGame1 = upcomingGamePairs[0];
        const pairedGame2 = upcomingGamePairs[1];
        return (
          <div key={index}>
            <Typography
              variant="p1Bold"
              marginRight="8px"
              marginLeft="8px"
              color={theme.palette.text.secondary}
              fontSize={fontSize}
            >
              {index === 0
                ? `Next ${pairedGame2 ? 'pairs' : ''}: `
                : `Upcoming ${pairedGame2 ? 'pair' : ''}: `}
            </Typography>
            <Typography
              variant="p1Medium"
              style={{ textDecoration: 'underline' }}
              fontSize={fontSize}
            >
              {pairedGame1.game.team1.teamName}
              <Typography variant="p1" style={{ textDecoration: 'none' }}>
                {' vs '}
              </Typography>
              {pairedGame1.game.team2.teamName}
            </Typography>
            {pairedGame2 && (
              <>
                <Typography padding="0px 4px">{', '}</Typography>
                <Typography
                  variant="p1Medium"
                  style={{ textDecoration: 'underline' }}
                  fontSize={fontSize}
                >
                  {pairedGame2.game.team1.teamName}
                  <Typography variant="p1" style={{ textDecoration: 'none' }}>
                    {' vs '}
                  </Typography>
                  {pairedGame2.game.team2.teamName}{' '}
                </Typography>
              </>
            )}{' '}
          </div>
        );
      })}
      {!disableNewWindowOpen && (
        <Tooltip title="Open Schedule In New Window" arrow placement="left">
          <IconButton
            onClick={openNewResultsWindow}
            style={{
              width: '40px',
              marginLeft: 'auto',
            }}
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              width={15}
              height={15}
              color={theme.palette.primary.main}
            />
          </IconButton>
        </Tooltip>
      )}
    </StyledFlexContainer>
  );
};

export default ScheduleUpcomingGames;
