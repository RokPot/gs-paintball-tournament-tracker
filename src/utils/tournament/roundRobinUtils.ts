import Game from 'types/Game';
import { GameSettings } from 'types/GameSettings';
import { GameState } from 'types/GameState';
import Team from 'types/Team';
import { shuffleArray } from 'utils/arrayUtils';
import { v4 } from 'uuid';

interface GameIndice {
  game1Indices: number[];
  game2Indices: number[];
  isUsed: boolean;
}
const checkIfthereAreSameTeamsRoundGame = (
  game1Indices: number[],
  game2Indices: number[],
) => {
  const isFirstIndiceTheSame = game1Indices.includes(game2Indices[0]);
  const isSecondIndiceTheSame = game1Indices.includes(game2Indices[1]);
  return isFirstIndiceTheSame || isSecondIndiceTheSame;
};

const removeIndicesIndexes = (
  indicesIndexesFree: number[],
  game1Index: number,
  game2Index: number,
) => {
  indicesIndexesFree.splice(game1Index, 1);
  indicesIndexesFree.splice(game2Index, 1);
  return indicesIndexesFree;
};

const seekAndReplaceTeamsWithOtherRoundsIfTheyPlaySequentially = (
  reorderedIndices: GameIndice[],
  currentIndiceRound: GameIndice,
) => {
  for (let i = reorderedIndices.length - 1; i >= 0; i -= 1) {
    let tmpRoundPrevious: GameIndice = {
      game1Indices: reorderedIndices[i].game1Indices,
      game2Indices: currentIndiceRound.game1Indices,
      isUsed: true,
    };
    let tmpRoundCurrent: GameIndice = {
      game1Indices: reorderedIndices[i].game2Indices,
      game2Indices: currentIndiceRound.game2Indices,
      isUsed: true,
    };
    if (
      !checkIfthereAreSameTeamsRoundGame(
        tmpRoundCurrent.game1Indices,
        tmpRoundCurrent.game2Indices,
      ) &&
      !checkIfthereAreSameTeamsRoundGame(
        tmpRoundPrevious.game1Indices,
        tmpRoundPrevious.game2Indices,
      )
    ) {
      reorderedIndices[reorderedIndices.length - 1] = tmpRoundCurrent;
      reorderedIndices[i] = tmpRoundPrevious;

      return { newIndices: reorderedIndices, hasReordered: true };
    }
    tmpRoundPrevious = {
      game1Indices: reorderedIndices[i].game1Indices,
      game2Indices: currentIndiceRound.game2Indices,
      isUsed: true,
    };
    tmpRoundCurrent = {
      game1Indices: reorderedIndices[i].game2Indices,
      game2Indices: currentIndiceRound.game1Indices,
      isUsed: true,
    };
    if (
      !checkIfthereAreSameTeamsRoundGame(
        tmpRoundCurrent.game1Indices,
        tmpRoundCurrent.game2Indices,
      ) &&
      !checkIfthereAreSameTeamsRoundGame(
        tmpRoundPrevious.game1Indices,
        tmpRoundPrevious.game2Indices,
      )
    ) {
      reorderedIndices[reorderedIndices.length - 1] = tmpRoundCurrent;
      reorderedIndices[i] = tmpRoundPrevious;

      return { newIndices: reorderedIndices, hasReordered: true };
    }
  }
  return { newIndices: reorderedIndices, hasReordered: false };
};

export const sortTeamIndicesIntoGameIndices = (
  games: Game[],
  indices: number[][],
  totalNumberOfRounds: number,
) => {
  let gameIndicesWithSortedTeams: GameIndice[] = [];

  let retries = 0;
  // resolve current indices 1 2 3 4 5
  const indicesIndexesFree: number[] = [];
  for (let i = 0; i < indices.length; i += 1) {
    indicesIndexesFree.push(i);
  }
  const firstGameIndex = 0;
  let secondGameIndex = indicesIndexesFree.length - 1;

  while (retries < 100) {
    const game1Indices = indices[indicesIndexesFree[firstGameIndex]];
    let game2Indices = indices[indicesIndexesFree[secondGameIndex]];

    if (indicesIndexesFree.length <= 3) {
      gameIndicesWithSortedTeams.push({
        game1Indices,
        game2Indices,
        isUsed: true,
      });
      const currentIndiceRoundGroup =
        gameIndicesWithSortedTeams[gameIndicesWithSortedTeams.length - 1];
      if (
        checkIfthereAreSameTeamsRoundGame(
          currentIndiceRoundGroup.game1Indices,
          currentIndiceRoundGroup.game2Indices,
        )
      ) {
        const { newIndices } =
          seekAndReplaceTeamsWithOtherRoundsIfTheyPlaySequentially(
            gameIndicesWithSortedTeams,
            currentIndiceRoundGroup,
          );
        gameIndicesWithSortedTeams = [...newIndices];
      }
      removeIndicesIndexes(indicesIndexesFree, secondGameIndex, firstGameIndex);
      if (indicesIndexesFree.length === 1) {
        gameIndicesWithSortedTeams.push({
          game1Indices: indices[indicesIndexesFree[0]],
          game2Indices: [],
          isUsed: true,
        });
      }

      break;
    }

    if (checkIfthereAreSameTeamsRoundGame(game1Indices, game2Indices)) {
      let foundProperIndice = false;
      for (let i = secondGameIndex; i > firstGameIndex; i -= 1) {
        game2Indices = indices[indicesIndexesFree[i]];
        if (
          !checkIfthereAreSameTeamsRoundGame(game1Indices, game2Indices) &&
          indicesIndexesFree.includes(i)
        ) {
          gameIndicesWithSortedTeams.push({
            game1Indices,
            game2Indices,
            isUsed: true,
          });
          removeIndicesIndexes(indicesIndexesFree, i, firstGameIndex);
          foundProperIndice = true;
          break;
        }
      }
      if (!foundProperIndice) {
        // if we've come here that means that there are no more viable free indices and we need to check
        // already set round for a swap
        game2Indices = indices[indicesIndexesFree[secondGameIndex]];
        gameIndicesWithSortedTeams.push({
          game1Indices,
          game2Indices,
          isUsed: true,
        });
        const currentIndiceRoundGroup =
          gameIndicesWithSortedTeams[gameIndicesWithSortedTeams.length - 1];
        const { hasReordered, newIndices } =
          seekAndReplaceTeamsWithOtherRoundsIfTheyPlaySequentially(
            gameIndicesWithSortedTeams,
            currentIndiceRoundGroup,
          );
        gameIndicesWithSortedTeams = [...newIndices];
        if (hasReordered) {
          removeIndicesIndexes(
            indicesIndexesFree,
            secondGameIndex,
            firstGameIndex,
          );
        }
      }
    } else {
      removeIndicesIndexes(indicesIndexesFree, secondGameIndex, firstGameIndex);

      gameIndicesWithSortedTeams.push({
        game1Indices,
        game2Indices,
        isUsed: true,
      });
    }

    retries += 1;
    secondGameIndex = indicesIndexesFree.length - 1;
    if (gameIndicesWithSortedTeams.length >= totalNumberOfRounds) {
      break;
    }
  }

  return gameIndicesWithSortedTeams;
};

export const generateGamesForRoundRobin = (
  teams: Team[],
  gameSettings: GameSettings,
) => {
  const numberOfTeams = teams.length;
  const numberOfGames = (numberOfTeams * (numberOfTeams - 1)) / 2;
  const numberOfRounds = Math.floor(numberOfGames / 2);
  const totalNumberOfRounds = numberOfRounds + (numberOfGames % 2 > 0 ? 1 : 0);

  const games: Game[] = [];
  const indices: number[][] = [];
  for (let i = 0; i < numberOfTeams; i += 1) {
    for (let j = i + 1; j < numberOfTeams; j += 1) {
      const newId = v4();
      const newGame: Game = new Game({
        gameState: GameState.created,
        id: newId,
        _id: newId,
        matches: [],
        team1: teams[i],
        team1Wins: 0,
        team2: teams[j],
        team2Wins: 0,
        bracketProperties: null,
        gameTime: gameSettings.gameTimeInSeconds,
      });
      games.push(newGame);
      indices.push([i, j]);
    }
  }
  const gameIndicesWithSortedTeams = sortTeamIndicesIntoGameIndices(
    games,
    indices,
    totalNumberOfRounds,
  );

  const shuffledGameIndicesWithSortedTeams = shuffleArray(
    gameIndicesWithSortedTeams,
  );

  const newGames: Game[] = [];
  for (let i = 0; i < shuffledGameIndicesWithSortedTeams.length; i += 1) {
    const { game1Indices, game2Indices } =
      shuffledGameIndicesWithSortedTeams[i];

    const newId = v4();
    const newRoundGame1: Game = new Game({
      gameState: GameState.created,
      id: newId,
      _id: newId,
      matches: [],
      team1: teams[game1Indices[0]],
      team1Wins: 0,
      team2: teams[game1Indices[1]],
      team2Wins: 0,
      bracketProperties: null,
      gameTime: gameSettings.gameTimeInSeconds,
    });
    newGames.push(newRoundGame1);

    if (game2Indices.length > 0) {
      const newId2 = v4();

      const newRoundGame2: Game = new Game({
        gameState: GameState.created,
        id: newId2,
        _id: newId2,
        matches: [],
        team1: teams[game2Indices[0]],
        team1Wins: 0,
        team2: teams[game2Indices[1]],
        team2Wins: 0,
        bracketProperties: null,
        gameTime: gameSettings.gameTimeInSeconds,
      });
      newGames.push(newRoundGame2);
    }
  }

  return {
    shuffledGameIndicesWithSortedTeams,
    numberOfGames,
    numberOfRounds,
    totalNumberOfRounds,
    games: newGames,
  };
};
