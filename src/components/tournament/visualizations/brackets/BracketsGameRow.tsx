import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import Game from 'types/Game';
import BracketsTeamRow from './BracketsTeamRow';

interface IProps {
  title?: string;
  game: Game;
}

const BracketsGameRow: React.FC<IProps> = ({ game }) => {
  return (
    <FlexContainer
      flexDirection="row"
      position="relative"
      padding="0px 00px 0px 0px"
    >
      <FlexContainer flexDirection="column" position="relative">
        {game?.bracketProperties?.isThridPlaceGame && (
          <Typography position="absolute" variant="p1" top={-20}>
            Third place
          </Typography>
        )}

        <BracketsTeamRow team={game.team1} teamScore={game.team1Wins} />
        <BracketsTeamRow team={game.team2} teamScore={game.team2Wins} />
      </FlexContainer>
    </FlexContainer>
  );
};

export default BracketsGameRow;
