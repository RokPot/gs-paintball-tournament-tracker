import FlexContainer from 'components/shared/FlexContainer';
import Game from 'types/Game';
import { GameState } from 'types/GameState';
import Tournament from 'types/Tournament';
import { TournamentStatusLabels } from 'types/TournamentStatus';
import { TournamentTypeLabels } from 'types/TournamentType';
import TournamentDetailsInfoRow from './TournamentDetailsInfoRow';

interface IProps {
  tournament: Tournament;
}

const TournamentDetailsList = ({ tournament }: IProps) => {
  const getTotalGames = (totalGamesType: 'finished' | 'unfinished' | 'all') => {
    const checkForGameState = (game: Game) => {
      switch (totalGamesType) {
        case 'all':
          return true;
        case 'finished':
          return game.gameState === GameState.finished;
        case 'unfinished':
          return game.gameState !== GameState.finished;
        default:
          return true;
      }
    };
    const totalGames =
      tournament?.stages?.reduce(
        (prev, curr) =>
          curr.groups
            .flatMap((group) => group.games)
            .filter((game) => checkForGameState(game)).length,
        0,
      ) || 0;
    return totalGames;
  };

  const getYesNoFromBoolean = (booleanValue: boolean) => {
    return booleanValue ? 'Yes' : 'No';
  };

  return (
    <FlexContainer width="100%" justifyContent="flex-start" gap={16}>
      <FlexContainer
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        highlightRowOnHover
      >
        <TournamentDetailsInfoRow
          title="Status"
          value={TournamentStatusLabels[tournament.state.status]}
        />
        <TournamentDetailsInfoRow
          title="Tournament date"
          value={`${tournament?.startDate?.format('DD/MM/YYYY')} ${
            tournament?.endDate
              ? ` - ${tournament?.endDate?.format('DD/MM/YYYY')}`
              : ''
          }`}
        />
        <TournamentDetailsInfoRow
          title="Type"
          value={TournamentTypeLabels[tournament?.settings.type]}
        />
        <TournamentDetailsInfoRow
          title="Team size"
          value={`${tournament?.settings.numberOfTeamSize}-man`}
        />
      </FlexContainer>

      <FlexContainer
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        highlightRowOnHover
      >
        <TournamentDetailsInfoRow
          title="# of total games"
          value={getTotalGames('all')}
        />
        <TournamentDetailsInfoRow
          title="# of finished games"
          value={getTotalGames('finished')}
        />
        <TournamentDetailsInfoRow
          title="# of unfinished games"
          value={getTotalGames('unfinished')}
        />
        <TournamentDetailsInfoRow
          title="Required match wins"
          value={tournament?.settings.numberOfWinsRequired}
        />
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        highlightRowOnHover
      >
        <TournamentDetailsInfoRow
          title="Switch games"
          value={getYesNoFromBoolean(tournament?.settings?.switchGames)}
        />
        <TournamentDetailsInfoRow
          title="Number of Groups"
          value={tournament?.settings.numberOfGroups}
        />
        <TournamentDetailsInfoRow
          title="Switch groups"
          value={getYesNoFromBoolean(tournament?.settings?.switchGroups)}
        />
        <TournamentDetailsInfoRow
          title="Second stage type"
          value={
            tournament?.settings.secondStageType &&
            tournament?.settings.numberOfGroups > 1
              ? TournamentTypeLabels[tournament?.settings.secondStageType]
              : '/'
          }
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default TournamentDetailsList;
