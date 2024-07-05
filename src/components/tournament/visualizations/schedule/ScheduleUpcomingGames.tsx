import {
  faArrowUpRightFromSquare,
  faCaretRight,
  faLeftRight,
} from '@fortawesome/free-solid-svg-icons';
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

  const [upcomingGames, setUpcomingGames] = useState<TournamentScheduleGame[]>(
    [],
  );

  useEffect(() => {
    if (!activeLeague?.activeTournament) {
      return;
    }
    const notFinishedScheduledGames =
      activeLeague?.activeTournament.currentStage?.schedule?.filter(
        (scheduledGame) => scheduledGame.game.gameState === GameState.created,
      );
    setUpcomingGames(notFinishedScheduledGames?.slice(0, 2) || []);
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
      <Typography
        variant="p1Bold"
        marginRight="8px"
        color={theme.palette.text.secondary}
        fontSize={fontSize}
      >
        Upcoming games:
      </Typography>

      {upcomingGames.map((upcomingGame, index) => (
        <div key={index}>
          <Typography
            variant="p1Medium"
            style={{ textDecoration: 'underline' }}
            fontSize={fontSize}
          >
            {upcomingGame.game.team1.teamName}
            <FontAwesomeIcon
              icon={faLeftRight}
              style={{ margin: '0px 8px' }}
              color={theme.palette.text.secondary}
            />
            {upcomingGame.game.team2.teamName}
          </Typography>
          {index + 1 < upcomingGames.length && (
            <FontAwesomeIcon
              icon={faCaretRight}
              style={{ margin: '0px 8px' }}
              color={theme.palette.primary.main}
            />
          )}
        </div>
      ))}
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
