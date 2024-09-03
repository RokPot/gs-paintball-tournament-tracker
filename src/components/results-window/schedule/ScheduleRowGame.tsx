import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography, css, styled, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import Game from 'types/Game';
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
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
);

interface IProps {
  gameNumber: number;
  game: Game;
}

const ScheduleRowGame: React.FC<IProps> = ({ game, gameNumber }) => {
  const theme = useTheme();
  return (
    <StyledGameContainer>
      <FlexContainer alignItems="center" width="100%" height="50px" gap={8}>
        <Typography
          variant="h6Medium"
          textAlign="end"
          marginBottom="0px"
          fontSize={25}
        >
          Game: {gameNumber}
        </Typography>

        <Typography
          variant="p1"
          minWidth="250px"
          textAlign="end"
          maxWidth="250px"
          fontSize={30}
        >
          {game.team1.id === undefined ? 'TBD' : game.team1.teamName}
        </Typography>
        <StyledScoreCardContainer>
          <Typography
            variant="p1Bold"
            color={theme.palette.common.white}
            fontSize={30}
          >
            {game.team1Wins}
          </Typography>
        </StyledScoreCardContainer>

        <Typography variant="p2Medium" fontSize={30}>
          VS
        </Typography>

        <StyledScoreCardContainer>
          <Typography
            variant="p1Bold"
            color={theme.palette.common.white}
            fontSize={30}
          >
            {game.team2Wins}
          </Typography>
        </StyledScoreCardContainer>
        <Typography variant="p1" maxWidth="250px" fontSize={30}>
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
      </FlexContainer>
    </StyledGameContainer>
  );
};

export default ScheduleRowGame;
