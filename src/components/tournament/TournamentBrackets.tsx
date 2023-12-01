import BracketsRoundColumn from 'components/brackets/BracketsRoundColumn';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import { generateGamesForEliminationBrackets } from 'utils/tournamentUtils';

interface IProps {
  activeLeague: League;
}

const TournamentBrackets = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;
  if (!selectedTournament || !activeLeague) {
    return null;
  }

  const { games, totalNumberOfRounds } = generateGamesForEliminationBrackets(
    [],
  );

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
              (game) =>
                game.bracketProperties?.round === index &&
                !game.bracketProperties?.bye,
            )}
            round={index}
            nextRoundGames={games.filter(
              (game) => game.bracketProperties?.round === index + 1,
            )}
          />
        );
      })}
    </FlexContainer>
  );
};

export default TournamentBrackets;
