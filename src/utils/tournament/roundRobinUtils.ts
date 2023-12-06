import Game from 'types/Game';
import { GameState } from 'types/GameState';
import Team from 'types/Team';
import { v4 } from 'uuid';

interface GameIndices {
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

const seekAndReplaceTeamsWithOtherRoundsIfTheyPlaySequentially = (
  reorderedIndices: GameIndices[],
  currentIndiceRound: GameIndices,
) => {
  for (let i = reorderedIndices.length - 1; i >= 0; i -= 1) {
    let tmpRoundPrevious: GameIndices = {
      game1Indices: reorderedIndices[i].game1Indices,
      game2Indices: currentIndiceRound.game1Indices,
      isUsed: true,
    };
    let tmpRoundCurrent: GameIndices = {
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

export const reorderRoundRobinGames = (
  games: Game[],
  indices: number[][],
  numberOfGames: number,
) => {
  let reorderedIndices: GameIndices[] = [];

  let retries = 0;
  // resolve current indices 1 2 3 4 5
  const indicesIndexesFree: number[] = [];
  for (let i = 0; i < indices.length; i += 1) {
    indicesIndexesFree.push(i);
  }
  const firstGameIndex = 0;
  let secondGameIndex = indicesIndexesFree.length - 1;

  while (retries < 100) {
    // console.log(retries);
    const game1Indices = indices[indicesIndexesFree[firstGameIndex]];
    let game2Indices = indices[indicesIndexesFree[secondGameIndex]];

    if (indicesIndexesFree.length <= 3) {
      reorderedIndices.push({ game1Indices, game2Indices, isUsed: true });
      const currentIndiceRoundGroup =
        reorderedIndices[reorderedIndices.length - 1];
      if (
        checkIfthereAreSameTeamsRoundGame(
          currentIndiceRoundGroup.game1Indices,
          currentIndiceRoundGroup.game2Indices,
        )
      ) {
        const { newIndices } =
          seekAndReplaceTeamsWithOtherRoundsIfTheyPlaySequentially(
            reorderedIndices,
            currentIndiceRoundGroup,
          );
        reorderedIndices = [...newIndices];
      }
      indicesIndexesFree.splice(secondGameIndex, 1);
      indicesIndexesFree.splice(firstGameIndex, 1);
      if (indicesIndexesFree.length === 1) {
        reorderedIndices.push({
          game1Indices: indices[indicesIndexesFree[0]],
          game2Indices: [],
          isUsed: true,
        });
      }
      console.log(
        '2 or 3',
        indicesIndexesFree.length,
        indicesIndexesFree,
        reorderedIndices.map(
          (indicee) =>
            `${indicee.game1Indices.toString()} and ${indicee.game2Indices.toString()}`,
        ),
      );
      return reorderedIndices;
    }

    // if (indicesIndexesFree.length === 3) {
    //   reorderedIndices.push({ game1Indices, game2Indices, isUsed: true });
    //   const currentIndiceRoundGroup =
    //     reorderedIndices[reorderedIndices.length - 1];
    //   const { hasReordered, newIndices } =
    //     seekAndReplaceTeamsWithOtherRoundsIfTheyPlaySequentially(
    //       reorderedIndices,
    //       currentIndiceRoundGroup,
    //     );
    //   reorderedIndices = [...newIndices];
    //   if (hasReordered) {
    //     indicesIndexesFree.splice(secondGameIndex, 1);
    //     indicesIndexesFree.splice(firstGameIndex, 1);
    //   }

    //   reorderedIndices.push({
    //     game1Indices: indices[indicesIndexesFree[0]],
    //     game2Indices: [],
    //     isUsed: true,
    //   });

    //   console.log(
    //     'break at 3',
    //     reorderedIndices.map(
    //       (indicee) =>
    //         `${indicee.game1Indices.toString()} and ${indicee.game2Indices.toString()}`,
    //     ),
    //   );
    //   return reorderedIndices;
    // }

    if (checkIfthereAreSameTeamsRoundGame(game1Indices, game2Indices)) {
      let foundProperIndice = false;
      for (let i = secondGameIndex; i > firstGameIndex; i -= 1) {
        game2Indices = indices[indicesIndexesFree[i]];
        if (
          !checkIfthereAreSameTeamsRoundGame(game1Indices, game2Indices) &&
          indicesIndexesFree.includes(i)
        ) {
          reorderedIndices.push({ game1Indices, game2Indices, isUsed: true });
          indicesIndexesFree.splice(i, 1);
          indicesIndexesFree.splice(firstGameIndex, 1);
          foundProperIndice = true;
          break;
        }
      }
      if (!foundProperIndice) {
        // if we've come here that means that there are no more viable free indices 1 2 3 5
        game2Indices = indices[indicesIndexesFree[secondGameIndex]];
        reorderedIndices.push({ game1Indices, game2Indices, isUsed: true });
        const currentIndiceRoundGroup =
          reorderedIndices[reorderedIndices.length - 1];
        const { hasReordered, newIndices } =
          seekAndReplaceTeamsWithOtherRoundsIfTheyPlaySequentially(
            reorderedIndices,
            currentIndiceRoundGroup,
          );
        reorderedIndices = [...newIndices];
        if (hasReordered) {
          indicesIndexesFree.splice(secondGameIndex, 1);
          indicesIndexesFree.splice(firstGameIndex, 1);
        }
      }
    } else {
      indicesIndexesFree.splice(secondGameIndex, 1);
      indicesIndexesFree.splice(firstGameIndex, 1);
      reorderedIndices.push({ game1Indices, game2Indices, isUsed: true });
    }
    retries += 1;
    secondGameIndex = indicesIndexesFree.length - 1;
    if (reorderedIndices.length >= numberOfGames / 2) {
      break;
    }
  }
  console.log(
    'standard',
    indicesIndexesFree.length,
    indicesIndexesFree,
    reorderedIndices.map(
      (indicee) =>
        `${indicee.game1Indices.toString()} and ${indicee.game2Indices.toString()}`,
    ),
  );
  return reorderedIndices;
};

export const generateGamesForRoundRobin = (teams: Team[]) => {
  const numberOfTeams = teams.length;
  const numberOfGames = (numberOfTeams * (numberOfTeams - 1)) / 2;
  const numberOfRounds = Math.floor(numberOfGames / 2);
  const totalNumberOfRounds = numberOfRounds + (numberOfGames % 2) > 0 ? 1 : 0;

  // console.log('numberOfTeams', numberOfTeams);
  // console.log('numberOfGames', numberOfGames);
  // console.log('numberOfRounds', numberOfRounds);
  // console.log('totalNumberOfRounds', totalNumberOfRounds);
  // console.log('gamesLeft', gamesLeft);
  const games: Game[] = [];
  const indices: number[][] = [];
  for (let i = 0; i < numberOfTeams; i += 1) {
    for (let j = i + 1; j < numberOfTeams; j += 1) {
      const newGame: Game = {
        gameState: GameState.created,
        id: v4(),
        matches: [],
        team1: teams[i],
        team1Wins: 0,
        team2: teams[j],
        team2Wins: 0,
        bracketProperties: null,
      };
      games.push(newGame);
      indices.push([i, j]);
    }
  }
  const reorderedIndices = reorderRoundRobinGames(
    games,
    indices,
    numberOfGames,
  );
  return {
    reorderedIndices,
    numberOfGames,
    numberOfRounds,
    totalNumberOfRounds,
  };
};
