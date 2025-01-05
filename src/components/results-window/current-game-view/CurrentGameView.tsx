import { Typography, lighten, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import { useEffect, useMemo, useState } from 'react';
import League from 'types/League';
import { millisecondsToTime } from 'utils/dateUtils';
import { clearInterval, setInterval } from 'worker-timers';
import ScoreDisplay from './ScoreDisplay';
import TeamDisplay from './TeamDisplay';

interface IProps {
  activeLeague?: League | null;
}

const CurrentGameView: React.FC<IProps> = ({ activeLeague }) => {
  const theme = useTheme();
  const [gameDuration, setGameDuration] = useState<number>();
  const fontSize = 1;
  const fontSizeH1 = `${fontSize * 8}em`;
  const fontSizeH2 = `${fontSize * 10}em`;

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

  useEffect(() => {
    const getFreshGameDuration = async () => {
      const freshGameDuration = Number(localStorage.getItem('gameDuration'));
      setGameDuration(freshGameDuration);
    };
    const gameInterval = setInterval(() => {
      getFreshGameDuration();
    }, 1000);

    return () => clearInterval(gameInterval);
  }, []);

  const formattedDuration = millisecondsToTime(gameDuration || 0);

  if (!activeScheduledGame?.game) {
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
      <FlexContainer
        gap={16}
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <TeamDisplay
          team={activeScheduledGame.game.team1}
          fontSize={fontSizeH1}
          align="end"
        />
        <ScoreDisplay
          teamWins={activeScheduledGame.game.team1Wins}
          fontSize={fontSizeH1}
        />
        <Typography variant="h6Medium" fontSize={30}>
          VS
        </Typography>
        <ScoreDisplay
          teamWins={activeScheduledGame.game.team2Wins}
          fontSize={fontSizeH1}
        />
        <TeamDisplay
          team={activeScheduledGame.game.team2}
          fontSize={fontSizeH1}
          align="start"
        />
      </FlexContainer>
      <FlexContainer width="100%" alignItems="center" justifyContent="center">
        <Typography
          variant="h3Medium"
          fontSize={fontSizeH2}
          lineHeight="0.8em"
          variantMapping={{ h3Medium: 'span' }}
        >
          {formattedDuration.formatted}
        </Typography>
      </FlexContainer>
    </FlexContainer>
  );
};

export default CurrentGameView;
