import { faEdit, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Typography, css, styled, useTheme } from '@mui/material';
import CustomDropdownMenu from 'components/shared/CustomDropdownMenu';
import FlexContainer from 'components/shared/FlexContainer';
import Game from 'types/Game';
import { GameState } from 'types/GameState';
import ScheduleGameStatus from './ScheduleGameStatus';

const StyledGameContainer = styled('div')(
  (props) => css`
    padding: 8px;
    border-radius: 3px;

    width: 100%;
    &:hover {
      background: ${props.theme.palette.grey[200]};
    }
  `,
);

const StyledScoreCardContainer = styled('div')(
  (props) => css`
    padding: 4px;
    border-radius: 3px;
    background: ${props.theme.palette.primary.light};
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
);

interface IProps {
  gameNumber: number;
  game: Game;
  onEditGame: (gameToEdit: Game) => void;
  disableEditting?: boolean;
}

const ScheduleRowGame: React.FC<IProps> = ({
  game,
  gameNumber,
  onEditGame,
  disableEditting,
}) => {
  const theme = useTheme();
  return (
    <StyledGameContainer>
      <FlexContainer alignItems="center" width="100%" height="50px" gap={8}>
        <Typography variant="h6Medium" textAlign="end" marginBottom="0px">
          Game: {gameNumber}
        </Typography>

        <Typography variant="p1" minWidth="100px" textAlign="end">
          {game.team1.teamName}
        </Typography>
        <StyledScoreCardContainer>
          <Typography variant="p1Bold" color={theme.palette.common.white}>
            {game.team1Wins}
          </Typography>
        </StyledScoreCardContainer>

        <Typography variant="p2Medium">VS</Typography>

        <StyledScoreCardContainer>
          <Typography variant="p1Bold" color={theme.palette.common.white}>
            {game.team2Wins}
          </Typography>
        </StyledScoreCardContainer>
        <Typography variant="p1">{game.team2.teamName}</Typography>
        <ScheduleGameStatus gameState={game.gameState} />

        {!disableEditting && game?.gameState === GameState.finished && (
          <div style={{ marginLeft: 'auto' }}>
            <CustomDropdownMenu
              icon={faEllipsisVertical}
              actions={[
                {
                  label: 'Edit game',
                  icon: faEdit,
                  onClick: () => {
                    onEditGame(game);
                  },
                  visible: true,
                },
              ]}
            />
          </div>
        )}
      </FlexContainer>
    </StyledGameContainer>
  );
};

export default ScheduleRowGame;
