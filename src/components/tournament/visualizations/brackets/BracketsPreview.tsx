import Game from 'types/Game';
import BracketsContainer from './BracketsContainer';

interface IProps {
  className?: string;
  games: Game[];
  totalNumberOfRounds: number;
}

const BracketsPreview: React.FC<IProps> = ({ games, totalNumberOfRounds }) => {
  return (
    <div style={{ paddingLeft: '15px' }}>
      <BracketsContainer
        games={games}
        totalNumberOfRounds={totalNumberOfRounds}
      />
    </div>
  );
};

export default BracketsPreview;
