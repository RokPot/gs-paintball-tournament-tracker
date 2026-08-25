import { Typography, lighten, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import useIPCRendererMessages, {
  TimerData,
} from 'hooks/main/useIPCRendererMessages';
import { useEffect, useState } from 'react';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { millisecondsToTime } from 'utils/dateUtils';
import ScoreDisplay from './ScoreDisplay';
import TeamDisplay from './TeamDisplay';

export const HERO_FONT_SIZES = {
  team: 'clamp(1.8rem, 9vh, 10rem)',
  versus: 'clamp(1rem, 3.5vh, 3.5rem)',
  clock: 'clamp(3rem, 18vh, 20rem)',
};

interface IProps {
  activeGame?: TournamentScheduleGame;
}

const CurrentGameView: React.FC<IProps> = ({ activeGame }) => {
  const theme = useTheme();
  const [timerData, setTimerData] = useState<TimerData>();
  const { listenToTimerUpdate } = useIPCRendererMessages();

  useEffect(() => {
    return listenToTimerUpdate((newTimerData: TimerData) => {
      setTimerData(newTimerData);
    });
  }, [listenToTimerUpdate]);

  useEffect(() => {
    if (!activeGame) {
      return;
    }

    const { game } = activeGame;
    if (!game) {
      return;
    }

    setTimerData({
      duration: game.gameTime * 1000,
      currentDuration: 0,
      breakDuration: 0,
      timingBreak: false,
      timingGame: false,
    });
  }, [activeGame]);

  const isBreak = !!timerData?.timingBreak;

  const displayedTime = millisecondsToTime(
    isBreak ? timerData?.breakDuration : timerData?.duration,
  );

  if (!activeGame?.game) {
    return null;
  }

  return (
    <FlexContainer
      width="100%"
      style={{
        background: lighten(theme.palette.primary.light, 0.7),
        boxShadow: `0 4px 4px ${lighten(theme.palette.primary.light, 0.5)}`,
        boxSizing: 'border-box',
      }}
      maxHeight="45vh"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={8}
      padding="1.5vh 16px"
    >
      <FlexContainer
        gap={16}
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <TeamDisplay
          team={activeGame.game.team1}
          fontSize={HERO_FONT_SIZES.team}
          align="end"
        />
        <ScoreDisplay
          teamWins={activeGame.game.team1Wins}
          fontSize={HERO_FONT_SIZES.team}
        />
        <Typography variant="h6Medium" fontSize={HERO_FONT_SIZES.versus}>
          VS
        </Typography>
        <ScoreDisplay
          teamWins={activeGame.game.team2Wins}
          fontSize={HERO_FONT_SIZES.team}
        />
        <TeamDisplay
          team={activeGame.game.team2}
          fontSize={HERO_FONT_SIZES.team}
          align="start"
        />
      </FlexContainer>

      <FlexContainer width="100%" alignItems="center" justifyContent="center">
        <Typography
          variant="h3Medium"
          fontSize={HERO_FONT_SIZES.clock}
          lineHeight="0.9em"
          variantMapping={{ h3Medium: 'span' }}
        >
          {displayedTime.formatted}
        </Typography>
      </FlexContainer>
    </FlexContainer>
  );
};

export default CurrentGameView;
