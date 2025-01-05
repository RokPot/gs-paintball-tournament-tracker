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
    display: flex;
    flex-direction: row;
    width: 100%;
    &:hover {
      background: ${props.theme.palette.grey[200]};
    }

    border-bottom: 1px solid ${props.theme.palette.divider};
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
  const fontSize = 1.2;
  const fontSizeH1 = `${fontSize * 2}em`;
  const fontSizeH2 = `${fontSize}em`;
  return (
    <StyledGameContainer>
      <FlexContainer
        alignItems="center"
        width="100%"
        height="50px"
        gap={8}
        position="relative"
      >
        <Typography
          variant="h6Medium"
          textAlign="start"
          marginBottom="0px"
          minWidth="50px"
          fontSize={fontSizeH1}
        >
          {gameNumber}:
        </Typography>

        <Typography
          variant="p1"
          textAlign="end"
          maxWidth="40%"
          width="100%"
          fontSize={fontSizeH1}
        >
          {game.team1.id === undefined ? 'TBD' : game.team1.teamName}
        </Typography>
        <StyledScoreCardContainer>
          <Typography
            variant="p1Bold"
            color={theme.palette.common.white}
            fontSize={fontSizeH1}
          >
            {game.team1Wins}
          </Typography>
        </StyledScoreCardContainer>

        <Typography variant="p2Medium" fontSize={fontSizeH1}>
          VS
        </Typography>

        <StyledScoreCardContainer>
          <Typography
            variant="p1Bold"
            color={theme.palette.common.white}
            fontSize={fontSizeH1}
          >
            {game.team2Wins}
          </Typography>
        </StyledScoreCardContainer>
        <Typography
          variant="p1"
          maxWidth="30%"
          width="100%"
          fontSize={fontSizeH1}
        >
          {game.team2.id === undefined ? 'TBD' : game.team2.teamName}
        </Typography>
      </FlexContainer>
      <FlexContainer minWidth="190px" justifyContent="flex-end">
        {game.bracketProperties?.isThridPlaceGame && (
          <Typography
            variant="p2Medium"
            marginBottom="0px"
            paddingLeft="8px"
            textAlign="center"
            color={theme.palette.text.secondary}
            fontSize={fontSizeH2}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <FontAwesomeIcon
              icon={faTrophy}
              color="#CD7F32"
              fontSize={fontSizeH2}
              style={{ paddingRight: '8px' }}
            />
            Third place Game
          </Typography>
        )}
        {game.bracketProperties?.isFirstPlaceGame && (
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
              fontSize={fontSizeH2}
              style={{ paddingRight: '8px' }}
            />
            First place Game
          </Typography>
        )}
        <ScheduleGameStatus gameState={game.gameState} />
      </FlexContainer>
    </StyledGameContainer>
  );
};

export default ScheduleRowGame;
