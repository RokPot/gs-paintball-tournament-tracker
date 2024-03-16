import { faCaretRight, faLeftRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography, lighten, styled, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { CSSProperties, useEffect, useState } from 'react';
import { GameState } from 'types/GameState';
import League from 'types/League';
import { TournamentScheduleGame } from 'types/TournamentScheduleGame';

interface IProps {
  activeLeague: League;
  style?: CSSProperties;
}

const StyledFlexContainer = styled(FlexContainer)`
  position: sticky;
  bottom: -16px;
  width: calc(100% + 32px);
  margin: auto -16px -16px -16px;
  background: ${(theme) => lighten(theme.theme?.palette?.primary.light, 0.7)};
  height: 50px;
  padding: 8px;
`;

const ScheduleUpcomingGames: React.FC<IProps> = ({ activeLeague, style }) => {
  const theme = useTheme();

  const [upcomingGames, setUpcomingGames] = useState<TournamentScheduleGame[]>(
    [],
  );

  useEffect(() => {
    if (!activeLeague?.activeTournament) {
      return;
    }
    const notFinishedScheduledGames =
      activeLeague?.activeTournament.schedule?.filter(
        (scheduledGame) => scheduledGame.game.gameState === GameState.created,
      );
    setUpcomingGames(notFinishedScheduledGames?.slice(0, 2) || []);
  }, [activeLeague?.activeTournament]);

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
      >
        Upcoming games:
      </Typography>

      {upcomingGames.map((upcomingGame, index) => (
        <>
          <Typography
            variant="p1Medium"
            style={{ textDecoration: 'underline' }}
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
        </>
      ))}
    </StyledFlexContainer>
  );
};

export default ScheduleUpcomingGames;
