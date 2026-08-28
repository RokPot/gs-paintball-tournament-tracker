import {
  faChevronDown,
  faChevronUp,
  faEdit,
  faEllipsisVertical,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Typography, css, styled, useTheme } from '@mui/material';
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
  nextGames?: {
    nextRoundGameWinner: Game | undefined;
    nextRoundGameLoser: Game | undefined;
  };
  onEditGame: (gameToEdit: Game) => void;
  disableEditting?: boolean;
  canReorder?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const ScheduleRowGame: React.FC<IProps> = ({
  game,
  gameNumber,
  onEditGame,
  disableEditting,
  nextGames,
  canReorder,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}) => {
  const areThereNextGames =
    !!nextGames?.nextRoundGameWinner && !!nextGames?.nextRoundGameLoser;
  const areAllNextGamesInCreatedState =
    nextGames?.nextRoundGameWinner?.gameState === GameState.created &&
    nextGames?.nextRoundGameLoser?.gameState === GameState.created;
  const canEditGame =
    !disableEditting &&
    ((areThereNextGames && areAllNextGamesInCreatedState) ||
      !areThereNextGames);

  const theme = useTheme();
  return (
    <StyledGameContainer>
      <FlexContainer alignItems="center" width="100%" height="50px" gap={8}>
        {canReorder && (
          <FlexContainer flexDirection="column" gap={0}>
            <IconButton
              size="small"
              aria-label="Move game up"
              disabled={!canMoveUp}
              onClick={onMoveUp}
              style={{ padding: '2px' }}
            >
              <FontAwesomeIcon icon={faChevronUp} width={12} height={12} />
            </IconButton>
            <IconButton
              size="small"
              aria-label="Move game down"
              disabled={!canMoveDown}
              onClick={onMoveDown}
              style={{ padding: '2px' }}
            >
              <FontAwesomeIcon icon={faChevronDown} width={12} height={12} />
            </IconButton>
          </FlexContainer>
        )}
        <Typography variant="h6Medium" textAlign="end" marginBottom="0px">
          Game: {gameNumber}
        </Typography>

        <Typography
          variant="p1"
          minWidth="250px"
          textAlign="end"
          maxWidth="250px"
        >
          {game.team1.id === undefined ? 'TBD' : game.team1.teamName}
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
        <Typography variant="p1" maxWidth="250px">
          {game.team2.id === undefined ? 'TBD' : game.team2.teamName}
        </Typography>
        <ScheduleGameStatus gameState={game.gameState} />
        {game.bracketProperties?.isThridPlaceGame ? (
          <Typography
            variant="p2Medium"
            marginBottom="0px"
            paddingLeft="8px"
            textAlign="center"
            color={theme.palette.text.secondary}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <FontAwesomeIcon
              icon={faTrophy}
              color="#CD7F32"
              fontSize={20}
              style={{ paddingRight: '8px' }}
            />
            Third place Game
          </Typography>
        ) : (
          ''
        )}
        {game.bracketProperties?.isFirstPlaceGame ? (
          <Typography
            variant="p2Medium"
            textAlign="end"
            marginBottom="0px"
            paddingLeft="16px"
            color={theme.palette.text.secondary}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <FontAwesomeIcon
              icon={faTrophy}
              color="#FFD700"
              fontSize={20}
              style={{ paddingRight: '8px' }}
            />
            First place Game
          </Typography>
        ) : (
          ''
        )}
        {canEditGame && (
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
