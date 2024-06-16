import { Typography, lighten, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useMemo } from 'react';
import League from 'types/League';
import { millisecondsToTime } from 'utils/dateUtils';
import ScoreDisplay from './ScoreDisplay';
import TeamDisplay from './TeamDisplay';

interface IProps {
  activeLeague?: League | null;
}

const CurrentGameView: React.FC<IProps> = ({ activeLeague }) => {
  const theme = useTheme();

  const activeScheduledGame = useMemo(() => {
    if (!activeLeague) {
      return undefined;
    }

    return activeLeague.activeTournament?.currentStageSchedule?.find(
      (scheduledGame) =>
        activeLeague?.activeTournament?.state?.activeGameId ===
        scheduledGame.id,
    );
  }, [activeLeague]);
  const formattedDuration = millisecondsToTime(
    activeScheduledGame?.game?.gameTime
      ? activeScheduledGame.game.gameTime * 1000
      : 0,
  );

  if (!activeScheduledGame) {
    return null;
  }
  return (
    <FlexContainer
      width="100%"
      style={{
        background: lighten(theme.palette?.primary.light, 0.7),
        boxShadow: `0 4px 4px ${lighten(theme.palette?.primary.light, 0.5)}`,
      }}
      height="auto"
      minHeight="250px"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="space-between"
      padding="16px"
    >
      <div style={{ position: 'absolute', top: '15px', left: '15px' }}>
        <Typography variant="p1Medium" color={theme.palette.text.secondary}>
          Active game
        </Typography>
      </div>

      <FlexContainer
        gap={16}
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <TeamDisplay team={activeScheduledGame.game.team1} />
        <ScoreDisplay teamWins={activeScheduledGame.game.team1Wins} />
        <Typography variant="h6Medium" fontSize={30}>
          VS
        </Typography>
        <ScoreDisplay teamWins={activeScheduledGame.game.team2Wins} />
        <TeamDisplay team={activeScheduledGame.game.team2} />
      </FlexContainer>
      <FlexContainer width="100%" alignItems="center" justifyContent="center">
        <Typography
          variant="h3Medium"
          fontSize={150}
          lineHeight={1}
          variantMapping={{ h3Medium: 'span' }}
        >
          {formattedDuration.formatted}
          <Typography
            variant="h6Medium"
            fontSize={60}
            display="inline-block"
            color={theme.palette.text.disabled}
            variantMapping={{ h6Medium: 'span' }}
          >
            .{formattedDuration.milisecondsString}
          </Typography>
        </Typography>
      </FlexContainer>
    </FlexContainer>
  );
};

export default CurrentGameView;
