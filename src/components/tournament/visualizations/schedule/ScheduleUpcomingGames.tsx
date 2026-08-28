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
import { CSSProperties, useContext, useMemo } from 'react';
import { TournamentContext } from 'store/TournamentContext';
import Team from 'types/Team';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentFlow } from 'utils/tournamentFlowUtils';

interface IProps {
  style?: CSSProperties;
  disableNewWindowOpen?: boolean;
  fontSize?: number;
  isInResultsWindow?: boolean;
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
  style,
  disableNewWindowOpen,
  fontSize = 14,
  isInResultsWindow,
}) => {
  const { activeLeague, tournamentRevision } = useContext(TournamentContext);

  const theme = useTheme();

  const { openNewResultsWindow } = useIPCRendererMessages();

  const upcomingGames = useMemo(
    () =>
      TournamentFlow.getUpcomingScheduleGameGroups(
        activeLeague?.activeTournament?.currentStage?.schedule,
      ),
    [
      activeLeague?.activeTournament?.currentStage?.schedule,
      tournamentRevision,
    ],
  );

  const getTeamName = (team: Team) => {
    if (isInResultsWindow) {
      return team.teamTag;
    }
    return team.teamName;
  };

  if (
    !activeLeague?.activeTournament ||
    activeLeague?.activeTournament.state.isTournamentFinished ||
    activeLeague?.activeTournament.state.status !== TournamentStatus.inProgress
  ) {
    return null;
  }
  return (
    <StyledFlexContainer
      flexDirection={isInResultsWindow ? 'column' : 'row'}
      justifyContent={isInResultsWindow ? 'space-around' : 'center'}
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
            <Typography variant="p1Medium" fontSize={fontSize}>
              {getTeamName(pairedGame1.game.team1) || 'TBD'}
              <Typography
                variant="p1"
                style={{ textDecoration: 'none' }}
                fontSize={isInResultsWindow ? fontSize - 20 : undefined}
              >
                {' vs '}
              </Typography>
              {getTeamName(pairedGame1.game.team2) || 'TBD'}
            </Typography>
            {pairedGame2 && (
              <>
                <Typography
                  padding="0px 4px"
                  fontSize={isInResultsWindow ? fontSize - 20 : undefined}
                >
                  {', '}
                </Typography>
                <Typography variant="p1Medium" fontSize={fontSize}>
                  {pairedGame2.game.team1.teamName || 'TBD'}
                  <Typography
                    variant="p1"
                    style={{ textDecoration: 'none' }}
                    fontSize={isInResultsWindow ? fontSize - 20 : undefined}
                  >
                    {' vs '}
                  </Typography>
                  {pairedGame2.game.team2.teamName || 'TBD'}
                </Typography>
              </>
            )}
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
