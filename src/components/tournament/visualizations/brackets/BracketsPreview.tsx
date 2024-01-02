import Game from 'types/Game';
import BracketsContainer from './BracketsContainer';

interface IProps {
  className?: string;
  games: Game[];
  totalNumberOfRounds: number;
}

const BracketsPreview: React.FC<IProps> = ({ games, totalNumberOfRounds }) => {
  return (
    <BracketsContainer
      games={games}
      totalNumberOfRounds={totalNumberOfRounds}
    />
  );
};

export default BracketsPreview;
