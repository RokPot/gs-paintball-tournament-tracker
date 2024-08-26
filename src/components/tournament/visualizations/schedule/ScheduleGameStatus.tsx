import { Theme, Tooltip, css, styled, useTheme } from '@mui/material';
import { GameState, GameStateLabels } from 'types/GameState';

interface IStyledGameStatusCircleProps {
  color?: string;
}

const StyledGameStatusCircle = styled('div')(
  (props: IStyledGameStatusCircleProps & { theme?: Theme }) => css`
    border-radius: 10px;
    height: 13px;
    width: 13px;

    background-color: ${props.color};
    margin: 4px;
  `,
);

const StyledAnimatedGameStatusCircle = styled(StyledGameStatusCircle)(
  (props: IStyledGameStatusCircleProps & { theme?: Theme }) => css`
    background-color: ${props.color};
  `,
);

interface IProps {
  gameState: GameState;
}

const ScheduleGameStatus: React.FC<IProps> = ({ gameState }) => {
  const theme = useTheme();

  const getGameStatusColor = () => {
    switch (gameState) {
      case GameState.finished:
        return theme.palette.error.main;
      case GameState.playing:
        return theme.palette.success.main;
      case GameState.waiting:
        return theme.palette.warning.main;
      default:
        return 'blue';
    }
  };

  if (
    ![GameState.finished, GameState.playing, GameState.waiting].includes(
      gameState,
    )
  ) {
    return null;
  }
  if (gameState === GameState.finished) {
    return (
      <Tooltip title={GameStateLabels[gameState]} arrow>
        <StyledGameStatusCircle color={theme.palette.error.main} />
      </Tooltip>
    );
  }
  return (
    <Tooltip title={GameStateLabels[gameState]} arrow>
      <StyledAnimatedGameStatusCircle color={getGameStatusColor()} />
    </Tooltip>
  );
};

export default ScheduleGameStatus;
