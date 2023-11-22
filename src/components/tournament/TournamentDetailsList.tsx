import FlexContainer from 'components/shared/FlexContainer';
import Game from 'types/Game';
import { GameState } from 'types/GameState';
import Tournament from 'types/Tournament';
import { TournamentStageLabels } from 'types/TournamentStage';
import { TournamentTypeLabels } from 'types/TournamentType';
import TournamentDetailsInfo from './TournamentDetailsInfo';

interface IProps {
  tournament: Tournament;
}

function TournamentDetailsList({ tournament }: IProps) {
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
      tournament?.groups.reduce(
        (prev, curr) =>
          curr.games.filter((game) => checkForGameState(game)).length,
        0,
      ) || 0;
    return totalGames <= 0 ? 'Tournament has not started yet' : totalGames;
  };

  const getYesNoFromBoolean = (booleanValue: boolean) => {
    return booleanValue ? 'Yes' : 'No';
  };

  return (
    <FlexContainer width="100%" justifyContent="flex-start" margin={16}>
      <FlexContainer
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        highlightRowOnHover
      >
        <TournamentDetailsInfo
          title="Status"
          value={TournamentStageLabels[tournament.state.stage]}
        />
        <TournamentDetailsInfo
          title="Tournament date"
          value={`${tournament?.startDate?.format('DD/MM/YYYY')} ${
            tournament?.endDate
              ? ` - ${tournament?.endDate?.format('DD/MM/YYYY')}`
              : ''
          }`}
        />
        <TournamentDetailsInfo
          title="Type"
          value={TournamentTypeLabels[tournament?.settings.type]}
        />
        <TournamentDetailsInfo
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
        <TournamentDetailsInfo
          title="# of total games"
          value={getTotalGames('all')}
        />
        <TournamentDetailsInfo
          title="# of finished games"
          value={getTotalGames('finished')}
        />
        <TournamentDetailsInfo
          title="# of unfinished games"
          value={getTotalGames('unfinished')}
        />
        <TournamentDetailsInfo
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
        <TournamentDetailsInfo
          title="Switch games"
          value={getYesNoFromBoolean(tournament?.settings?.switchGames)}
        />
        <TournamentDetailsInfo
          title="Number of Groups"
          value={tournament?.settings.numberOfGroups}
        />
        <TournamentDetailsInfo
          title="Switch groups"
          value={getYesNoFromBoolean(tournament?.settings?.switchGroups)}
        />
        <TournamentDetailsInfo
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
}

export default TournamentDetailsList;
