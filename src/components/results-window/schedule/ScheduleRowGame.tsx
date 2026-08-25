import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography, alpha, css, styled, useTheme } from '@mui/material';
import Game from 'types/Game';
import { GameState } from 'types/GameState';
import { getDisplayTeamName } from 'utils/tournamentUtils';
import ScheduleGameStatus from './ScheduleGameStatus';

const NAME_FONT_SIZE = 'clamp(1.2rem, 3.8vh, 2.8rem)';
const META_FONT_SIZE = 'clamp(1rem, 3vh, 2.2rem)';

/**
 * One template for every row, so a game that has started (and therefore shows
 * scores) lines up with one that has not, and the VS stays on the centre line.
 * The two edge columns are the same width to keep that centre true.
 */
const StyledGameContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(
  (props) => css`
    padding: 1vh 16px;
    display: grid;
    grid-template-columns:
      5.5em minmax(0, 1fr) 3em auto 3em
      minmax(0, 1fr) 5.5em;
    align-items: center;
    column-gap: 12px;
    width: 100%;
    box-sizing: border-box;
    background: ${props.isActive
      ? alpha(props.theme.palette.primary.main, 0.14)
      : 'transparent'};
    border-left: 4px solid
      ${props.isActive ? props.theme.palette.primary.main : 'transparent'};
    border-bottom: 1px solid ${props.theme.palette.divider};
  `,
);

const StyledScoreCardContainer = styled('div')(
  (props) => css`
    border-radius: 3px;
    background: ${props.theme.palette.primary.light};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.1em 0.25em;
  `,
);

const StyledStatusContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
`;

interface IProps {
  gameNumber: number;
  game: Game;
  isActive?: boolean;
}

const ResultsScheduleRowGame: React.FC<IProps> = ({
  game,
  gameNumber,
  isActive,
}) => {
  const theme = useTheme();
  // Unplayed games are all 0 - 0, so the score boxes are noise unless the game
  // is live or already has a result. The cells stay in place either way.
  const showScores = isActive || game.gameState !== GameState.created;
  const renderScore = (teamWins: number) =>
    showScores ? (
      <StyledScoreCardContainer>
        <Typography
          variant="p1Bold"
          color={theme.palette.common.white}
          fontSize={NAME_FONT_SIZE}
          lineHeight="1.2em"
        >
          {teamWins}
        </Typography>
      </StyledScoreCardContainer>
    ) : (
      <div />
    );

  return (
    <StyledGameContainer isActive={!!isActive}>
      <Typography
        variant="h6Medium"
        textAlign="start"
        fontSize={NAME_FONT_SIZE}
        lineHeight="1.2em"
        color={theme.palette.text.secondary}
      >
        {gameNumber}
      </Typography>

      <Typography
        variant="p1"
        textAlign="end"
        fontSize={NAME_FONT_SIZE}
        lineHeight="1.2em"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {getDisplayTeamName(game.team1, 18)}
      </Typography>

      {renderScore(game.team1Wins)}

      <Typography
        variant="p2Medium"
        fontSize={META_FONT_SIZE}
        color={showScores ? undefined : theme.palette.text.secondary}
      >
        VS
      </Typography>

      {renderScore(game.team2Wins)}

      <Typography
        variant="p1"
        textAlign="start"
        fontSize={NAME_FONT_SIZE}
        lineHeight="1.2em"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {getDisplayTeamName(game.team2, 18)}
      </Typography>

      <StyledStatusContainer>
        {game.bracketProperties?.isThridPlaceGame && (
          <FontAwesomeIcon
            icon={faTrophy}
            color="#CD7F32"
            fontSize={META_FONT_SIZE}
            title="Third place game"
          />
        )}
        {game.bracketProperties?.isFirstPlaceGame && (
          <FontAwesomeIcon
            icon={faTrophy}
            color="#FFD700"
            fontSize={META_FONT_SIZE}
            title="First place game"
          />
        )}
        <ScheduleGameStatus gameState={game.gameState} />
      </StyledStatusContainer>
    </StyledGameContainer>
  );
};

export default ResultsScheduleRowGame;
