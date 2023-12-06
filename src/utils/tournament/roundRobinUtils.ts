import Game from 'types/Game';
import { GameState } from 'types/GameState';
import Team from 'types/Team';
import { v4 } from 'uuid';

export const getRoundRobinGame = (teams: Team[]) => {
  console.log(teams);
};
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

const seekAndReplaceTeamsWithOtherRoundsIfTheyPlaySequentially = () => {};

export const reorderRoundRobinGames = (
  games: Game[],
  indices: number[][],
  numberOfGames: number,
) => {
  const reorderedIndices: GameIndices[] = [];

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

    if (indicesIndexesFree.length <= 2) {
      reorderedIndices.push({ game1Indices, game2Indices, isUsed: true });
      const currentIndiceRoundGroup =
        reorderedIndices[reorderedIndices.length - 1];

      for (let i = reorderedIndices.length - 1; i >= 0; i -= 1) {
        const tmpRoundPrevious: GameIndices = {
          game1Indices: reorderedIndices[i].game1Indices,
          game2Indices: currentIndiceRoundGroup.game1Indices,
          isUsed: true,
        };
        const tmpRoundCurrent: GameIndices = {
          game1Indices: reorderedIndices[i].game2Indices,
          game2Indices: currentIndiceRoundGroup.game2Indices,
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
          break;
        }
      }
      console.log(
        'break at 2',

        reorderedIndices.map(
          (indicee) =>
            `${indicee.game1Indices.toString()} and ${indicee.game2Indices.toString()}`,
        ),
      );
      return;
    }

    if (indicesIndexesFree.length === 3) {
      reorderedIndices.push({ game1Indices, game2Indices, isUsed: true });
      const currentIndiceRoundGroup =
        reorderedIndices[reorderedIndices.length - 1];
      for (let i = reorderedIndices.length - 1; i >= 0; i -= 1) {
        // const alreadySortedGame1Indices = reorderedIndices[i].game1Indices;
        // const alreadySortedGame2Indices = reorderedIndices[i].game2Indices;
        let tmpRoundPrevious: GameIndices = {
          game1Indices: reorderedIndices[i].game1Indices,
          game2Indices: currentIndiceRoundGroup.game1Indices,
          isUsed: true,
        };
        let tmpRoundCurrent: GameIndices = {
          game1Indices: reorderedIndices[i].game2Indices,
          game2Indices: currentIndiceRoundGroup.game2Indices,
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
          indicesIndexesFree.splice(secondGameIndex, 1);
          indicesIndexesFree.splice(firstGameIndex, 1);
          break;
        }
        tmpRoundPrevious = {
          game1Indices: reorderedIndices[i].game1Indices,
          game2Indices: currentIndiceRoundGroup.game2Indices,
          isUsed: true,
        };
        tmpRoundCurrent = {
          game1Indices: reorderedIndices[i].game2Indices,
          game2Indices: currentIndiceRoundGroup.game1Indices,
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
          indicesIndexesFree.splice(secondGameIndex, 1);
          indicesIndexesFree.splice(firstGameIndex, 1);
          break;
        }
      }

      reorderedIndices.push({
        game1Indices: indices[indicesIndexesFree[0]],
        game2Indices: [],
        isUsed: true,
      });

      console.log(
        'break at 3',
        reorderedIndices.map(
          (indicee) =>
            `${indicee.game1Indices.toString()} and ${indicee.game2Indices.toString()}`,
        ),
      );
      return;
    }

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
        for (let i = reorderedIndices.length - 1; i >= 0; i -= 1) {
          // const alreadySortedGame1Indices = reorderedIndices[i].game1Indices;
          // const alreadySortedGame2Indices = reorderedIndices[i].game2Indices;
          let tmpRoundPrevious: GameIndices = {
            game1Indices: reorderedIndices[i].game1Indices,
            game2Indices: currentIndiceRoundGroup.game1Indices,
            isUsed: true,
          };
          let tmpRoundCurrent: GameIndices = {
            game1Indices: reorderedIndices[i].game2Indices,
            game2Indices: currentIndiceRoundGroup.game2Indices,
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
            indicesIndexesFree.splice(secondGameIndex, 1);
            indicesIndexesFree.splice(firstGameIndex, 1);
            break;
          }
          tmpRoundPrevious = {
            game1Indices: reorderedIndices[i].game1Indices,
            game2Indices: currentIndiceRoundGroup.game2Indices,
            isUsed: true,
          };
          tmpRoundCurrent = {
            game1Indices: reorderedIndices[i].game2Indices,
            game2Indices: currentIndiceRoundGroup.game1Indices,
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
            indicesIndexesFree.splice(secondGameIndex, 1);
            indicesIndexesFree.splice(firstGameIndex, 1);
            break;
          }
        }
      }
    } else {
      // go to next round 5
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
};

export const generateGamesForRoundRobin = (teams: Team[]) => {
  const numberOfTeams = teams.length;
  const numberOfGames = (numberOfTeams * (numberOfTeams - 1)) / 2;
  const numberOfRounds = Math.floor(numberOfGames / 2);
  const gamesLeft = numberOfGames % 2;
  const totalNumberOfRounds = numberOfRounds + gamesLeft > 0 ? 1 : 0;

  console.log('numberOfTeams', numberOfTeams);
  console.log('numberOfGames', numberOfGames);
  console.log('numberOfRounds', numberOfRounds);
  console.log('totalNumberOfRounds', totalNumberOfRounds);
  console.log('gamesLeft', gamesLeft);
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
      console.log('team1', i, 'team2', j);
      indices.push([i, j]);
    }
  }
  reorderRoundRobinGames(games, indices, numberOfGames);
};
