import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import Game from 'types/Game';
import BracketsTeamRow from './BracketsTeamRow';

interface IProps {
  title?: string;
  game: Game;
}

const BracketsGameRow: React.FC<IProps> = ({ title, game }) => {
  return (
    <FlexContainer flexDirection="column" position="relative">
      {title && (
        <Typography position="absolute" variant="p1" top={-20}>
          {title}
        </Typography>
      )}

      <BracketsTeamRow team={game.team1} teamScore={game.team1Wins} />
      <BracketsTeamRow team={game.team2} teamScore={game.team2Wins} />
    </FlexContainer>
  );
};

export default BracketsGameRow;
