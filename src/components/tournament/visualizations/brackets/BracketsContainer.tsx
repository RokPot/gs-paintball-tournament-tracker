import FlexContainer from 'components/shared/FlexContainer';
import Game from 'types/Game';
import BracketsRoundColumn from './BracketsRoundColumn';

interface IProps {
  games: Game[];
  totalNumberOfRounds: number;
}

const BracketsContainer: React.FC<IProps> = ({
  games,
  totalNumberOfRounds,
}) => {
  return (
    <FlexContainer
      flexDirection="row"
      alignItems="flex-start"
      padding="20px 0px 0px 0px"
    >
      {[...Array(totalNumberOfRounds)].map((val, index) => {
        return (
          <BracketsRoundColumn
            isLastRound={index + 1 === totalNumberOfRounds}
            currentRoundGames={games.filter(
              (game) => game.bracketProperties?.round === index,
            )}
            round={index}
          />
        );
      })}
    </FlexContainer>
  );
};

export default BracketsContainer;
