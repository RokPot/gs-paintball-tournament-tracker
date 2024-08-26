import Game from 'types/Game';
import { GameWinner } from 'types/GameState';
import LeaderboardTeam from 'types/LeadeboardTeam';
import MatchState from 'types/MatchState';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentSettings } from 'types/TournamentSettings';
import { TournamentType } from 'types/TournamentType';
import { v4 } from 'uuid';

const NotViableTiebreaker = 'notViableTieBreaker';

enum TieResolveCheck {
  HeadToHead = 'headToHead',
  NumberOfPoints = 'numberOfPoints',
  NumberOfCleanGames = 'numberOfCleanGames',
  NumberOfMatchesWonInTiedGames = 'numberOfMatchesWonInTiedGames',
  MatchMargin = 'matchMargin',
  GreatestTimeRemainingAmongAllWonGames = 'greatestTimeRemainingAmongAllWonGames',
  GreatestTimeRemainingAmongTiedWonGames = 'greatestTimeRemainingAmongTiedWonGames',
  LeastTimeRemainingAmongAllLostGames = 'leastTimeRemainingAmongAllLostGames',
  LeastTimeRemainingAmongTiedLostGames = 'leastTimeRemainingAmongTiedLostGames',
}
const tieBreakChecks: TieResolveCheck[] = [
  TieResolveCheck.HeadToHead,
  TieResolveCheck.NumberOfMatchesWonInTiedGames,
  TieResolveCheck.MatchMargin,
  TieResolveCheck.NumberOfCleanGames,
  TieResolveCheck.GreatestTimeRemainingAmongTiedWonGames,
  TieResolveCheck.GreatestTimeRemainingAmongAllWonGames,
  TieResolveCheck.LeastTimeRemainingAmongTiedLostGames,
  TieResolveCheck.LeastTimeRemainingAmongAllLostGames,
];

interface ResolvedTiedTeam {
  rank: number;
  teamId: string;
}

interface LeaderboardTeamGameWins {
  teamId: string;
  numberOfWins: number;
  matchMargin: number;
  numberOfGamesPlayed: number;
  gameTimeRemainingSum: number;
}

type ResolvedTieBreaks = ResolvedTiedTeam[] | typeof NotViableTiebreaker;

const sortResolvedTeamsInACheck = <T,>(
  checkSortedTeams: T[],
  propToCheck: keyof T,
  propToPropagate: keyof T,
  beforeIterationCheck?: (sortedTeam: T, index: number) => boolean,
) => {
  const sortedTeams: ResolvedTiedTeam[] = [];
  for (let i = 0; i < checkSortedTeams.length; i += 1) {
    if (!beforeIterationCheck || beforeIterationCheck(checkSortedTeams[i], i)) {
      const previousSortedTeam = checkSortedTeams[i - 1];
      const currentSortedTeam = checkSortedTeams[i];
      const nextSortedTeam = checkSortedTeams[i + 1];
      if (
        (!previousSortedTeam ||
          previousSortedTeam?.[propToCheck] !==
            currentSortedTeam[propToCheck]) &&
        (!nextSortedTeam ||
          nextSortedTeam?.[propToCheck] !== currentSortedTeam[propToCheck])
      ) {
        sortedTeams.push({
          rank: i,
          teamId: currentSortedTeam[propToPropagate] as string,
        });
      } else {
        sortedTeams.push({
          rank: -1,
          teamId: currentSortedTeam[propToPropagate] as string,
        });
      }
    } else {
      sortedTeams.push({
        rank: -1,
        teamId: checkSortedTeams[i]?.[propToPropagate] as string,
      });
    }
  }
  return sortedTeams;
};

export const recalculateRankings = (leaderboardTeams: LeaderboardTeam[]) => {
  return leaderboardTeams.map(
    (leaderboardTeam, index) =>
      new LeaderboardTeam({
        ...leaderboardTeam,
        rank: index + 1,
        previousRank: leaderboardTeam.rank,
      }),
  );
};

const prepareTiedTeamsForProcessing = (
  leaderboardTeamsTied: LeaderboardTeam[],
) => {
  const leaderboardTeamGameWins: LeaderboardTeamGameWins[] = [];
  for (let j = 0; j < leaderboardTeamsTied.length; j += 1) {
    leaderboardTeamGameWins.push({
      teamId: leaderboardTeamsTied[j].team.id,
      numberOfWins: 0,
      matchMargin: 0,
      gameTimeRemainingSum: 0,
      numberOfGamesPlayed: 0,
    });
  }

  const teamsTiedId = leaderboardTeamsTied.map(
    (leaderboardTiedTeam) => leaderboardTiedTeam.team.id,
  );
  return { leaderboardTeamGameWins, teamsTiedId };
};

export const reorderResolvedTies = (
  resolvedTiedTeams: ResolvedTieBreaks,
  tiedLeaderboardTeams: LeaderboardTeam[],
  resolvedLeaderboardTeams: LeaderboardTeam[],
) => {
  if (resolvedTiedTeams === NotViableTiebreaker) {
    return {
      teamsLeft: tiedLeaderboardTeams,
      sortedLeaderboardTeam: [],
    };
  }
  const sortedLeaderboardTeam = [...resolvedLeaderboardTeams];
  const teamsLeft = [];

  for (let t = 0; t < resolvedTiedTeams.length; t += 1) {
    if (resolvedTiedTeams[t].rank !== -1) {
      // If we have a rank we can sort  it
      const teamToBeReplaced = tiedLeaderboardTeams.find(
        (leaderboardTeam) =>
          leaderboardTeam.team.id === resolvedTiedTeams[t].teamId,
      )!;
      sortedLeaderboardTeam.push(teamToBeReplaced);
    } else {
      // If we don't have a rank this means that the team couldn't be sorted
      const teamNotResolved = tiedLeaderboardTeams.find(
        (leaderboardTeam) =>
          leaderboardTeam.team.id === resolvedTiedTeams[t].teamId,
      )!;
      teamsLeft.push(teamNotResolved);
    }
  }
  return {
    teamsLeft,
    sortedLeaderboardTeam,
  };
};

const findLeaderBoardTeamGameTimeAndAddTime = (
  teamToCheck: Team,
  leaderBoardTeamGameTimes: LeaderboardTeamGameWins[],
  teamsTiedId: string[],
  gameTime: number,
) => {
  if (teamsTiedId.includes(teamToCheck.id)) {
    const leaderBoardTeamTime = leaderBoardTeamGameTimes.find(
      (leaderBoardTeamGameTime) =>
        leaderBoardTeamGameTime.teamId === teamToCheck.id,
    )!;
    leaderBoardTeamTime.numberOfGamesPlayed += 1;
    leaderBoardTeamTime.gameTimeRemainingSum += gameTime;
  }
  return leaderBoardTeamGameTimes;
};

const getGameTimeSumForTeams = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
  checkOnlyTiedGames: boolean,
  checkForTheWinningTeam: boolean,
) => {
  const { leaderboardTeamGameWins, teamsTiedId } =
    prepareTiedTeamsForProcessing(leaderboardTeamsTied);

  let leaderBoardTeamGameTimes = leaderboardTeamGameWins;

  finishedGames.forEach((finishedGame) => {
    if (!checkOnlyTiedGames) {
      if (finishedGame.gameWinner === GameWinner.team1) {
        const teamToCheck = checkForTheWinningTeam
          ? finishedGame.team1
          : finishedGame.team2;
        leaderBoardTeamGameTimes = findLeaderBoardTeamGameTimeAndAddTime(
          teamToCheck,
          leaderBoardTeamGameTimes,
          teamsTiedId,
          finishedGame.gameTime,
        );
      }
      if (finishedGame.gameWinner === GameWinner.team2) {
        const teamToCheck = checkForTheWinningTeam
          ? finishedGame.team2
          : finishedGame.team1;
        leaderBoardTeamGameTimes = findLeaderBoardTeamGameTimeAndAddTime(
          teamToCheck,
          leaderBoardTeamGameTimes,
          teamsTiedId,
          finishedGame.gameTime,
        );
      }
      return;
    }

    if (
      teamsTiedId.includes(finishedGame.team1.id) &&
      teamsTiedId.includes(finishedGame.team2.id)
    ) {
      if (finishedGame.gameWinner === GameWinner.team1) {
        const teamToCheck = checkForTheWinningTeam
          ? finishedGame.team1
          : finishedGame.team2;
        leaderBoardTeamGameTimes = findLeaderBoardTeamGameTimeAndAddTime(
          teamToCheck,
          leaderBoardTeamGameTimes,
          teamsTiedId,
          finishedGame.gameTime,
        );
      }
      if (finishedGame.gameWinner === GameWinner.team2) {
        const teamToCheck = checkForTheWinningTeam
          ? finishedGame.team2
          : finishedGame.team1;
        leaderBoardTeamGameTimes = findLeaderBoardTeamGameTimeAndAddTime(
          teamToCheck,
          leaderBoardTeamGameTimes,
          teamsTiedId,
          finishedGame.gameTime,
        );
      }

      if (finishedGame.gameWinner === GameWinner.draw) {
        leaderBoardTeamGameTimes = findLeaderBoardTeamGameTimeAndAddTime(
          finishedGame.team2,
          leaderBoardTeamGameTimes,
          teamsTiedId,
          finishedGame.gameTime,
        );
        leaderBoardTeamGameTimes = findLeaderBoardTeamGameTimeAndAddTime(
          finishedGame.team1,
          leaderBoardTeamGameTimes,
          teamsTiedId,
          finishedGame.gameTime,
        );
      }
    }
  });

  leaderBoardTeamGameTimes.forEach((gameTime) => {
    if (gameTime.gameTimeRemainingSum > 0) {
      gameTime.gameTimeRemainingSum /= gameTime.numberOfGamesPlayed;
    }
  });

  return leaderBoardTeamGameTimes;
};

const resolveWithHeadToHeadCheck = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
): ResolvedTieBreaks => {
  const { leaderboardTeamGameWins, teamsTiedId } =
    prepareTiedTeamsForProcessing(leaderboardTeamsTied);

  finishedGames.forEach((finishedGame) => {
    const areBothTeamsInTheGame =
      teamsTiedId.includes(finishedGame.team1.id) &&
      teamsTiedId.includes(finishedGame.team2.id);
    if (!areBothTeamsInTheGame) {
      return;
    }

    if (finishedGame.gameWinner === GameWinner.team1) {
      const currentHeadToHeadTeam = leaderboardTeamGameWins.find(
        (headToHeadTeam) => headToHeadTeam.teamId === finishedGame.team1.id,
      );
      currentHeadToHeadTeam!.numberOfWins += 1;
    } else if (finishedGame.gameWinner === GameWinner.team2) {
      const currentHeadToHeadTeam = leaderboardTeamGameWins.find(
        (headToHeadTeam) => headToHeadTeam.teamId === finishedGame.team2.id,
      );
      currentHeadToHeadTeam!.numberOfWins += 1;
    }
  });

  leaderboardTeamGameWins.sort((a, b) => b.numberOfWins - a.numberOfWins);

  return sortResolvedTeamsInACheck(
    leaderboardTeamGameWins,
    'numberOfWins',
    'teamId',
    (sortedTeam, index) =>
      sortedTeam.numberOfWins === leaderboardTeamGameWins.length - index - 1,
  );
};

const resolveWithLeastTimeRemainingCheck = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
  checkOnlyTiedGames: boolean,
): ResolvedTieBreaks => {
  const leaderBoardTeamGameTimes = getGameTimeSumForTeams(
    leaderboardTeamsTied,
    finishedGames,
    checkOnlyTiedGames,
    false,
  );

  if (checkOnlyTiedGames) {
    const numberOfGamesRequiredForEveryTeam = leaderboardTeamsTied.length - 1;

    const haveAllTeamsPlayedEachOther = leaderBoardTeamGameTimes.every(
      (leaderboardTeamGameTime) =>
        leaderboardTeamGameTime.numberOfGamesPlayed !==
        numberOfGamesRequiredForEveryTeam,
    );
    if (haveAllTeamsPlayedEachOther) {
      return NotViableTiebreaker;
    }
  }

  leaderBoardTeamGameTimes.sort(
    (a, b) => a.gameTimeRemainingSum - b.gameTimeRemainingSum,
  );

  return sortResolvedTeamsInACheck(
    leaderBoardTeamGameTimes,
    'gameTimeRemainingSum',
    'teamId',
  );
};

const resolveWithMostTimeRemainingCheck = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
  checkOnlyTiedGames: boolean,
): ResolvedTieBreaks => {
  const leaderBoardTeamGameTimes = getGameTimeSumForTeams(
    leaderboardTeamsTied,
    finishedGames,
    checkOnlyTiedGames,
    true,
  );

  if (checkOnlyTiedGames) {
    const numberOfGamesRequiredForEveryTeam = leaderboardTeamsTied.length - 1;

    const haveAllTeamsPlayedEachOther = leaderBoardTeamGameTimes.every(
      (leaderboardTeamGameTime) =>
        leaderboardTeamGameTime.numberOfGamesPlayed !==
        numberOfGamesRequiredForEveryTeam,
    );
    if (haveAllTeamsPlayedEachOther) {
      return NotViableTiebreaker;
    }
  }

  leaderBoardTeamGameTimes.sort(
    (a, b) => b.gameTimeRemainingSum - a.gameTimeRemainingSum,
  );

  return sortResolvedTeamsInACheck(
    leaderBoardTeamGameTimes,
    'gameTimeRemainingSum',
    'teamId',
  );
};

const resolveWithHighestNumberOfPointsCheck = (): ResolvedTieBreaks => {
  // TO DO Rokpot
  // Not sure what to do here since same point are why teams are tied
  return NotViableTiebreaker;
};

const resolveWithHighestNumberOfCleanGamesCheck = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
  tournamentSettings: TournamentSettings,
): ResolvedTieBreaks => {
  const { leaderboardTeamGameWins, teamsTiedId } =
    prepareTiedTeamsForProcessing(leaderboardTeamsTied);

  finishedGames.forEach((finishedGame) => {
    if (finishedGame.gameWinner === GameWinner.team1) {
      if (teamsTiedId.includes(finishedGame.team1.id)) {
        if (finishedGame.team1Wins >= tournamentSettings.numberOfWinsRequired) {
          const currentLeaderboardTeam = leaderboardTeamGameWins.find(
            (headToHeadTeam) => headToHeadTeam.teamId === finishedGame.team1.id,
          )!;
          currentLeaderboardTeam.numberOfWins += 1;
        }
      }
    }
    if (finishedGame.gameWinner === GameWinner.team1) {
      if (teamsTiedId.includes(finishedGame.team2.id)) {
        if (finishedGame.team2Wins >= tournamentSettings.numberOfWinsRequired) {
          const currentLeaderboardTeam = leaderboardTeamGameWins.find(
            (headToHeadTeam) => headToHeadTeam.teamId === finishedGame.team2.id,
          )!;
          currentLeaderboardTeam.numberOfWins += 1;
        }
      }
    }
  });

  leaderboardTeamGameWins.sort((a, b) => b.numberOfWins - a.numberOfWins);
  return sortResolvedTeamsInACheck(
    leaderboardTeamGameWins,
    'numberOfWins',
    'teamId',
  );
};

const resolveWithNumberOfMatchesWonInTiedGamesCheck = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
): ResolvedTieBreaks => {
  const { leaderboardTeamGameWins, teamsTiedId } =
    prepareTiedTeamsForProcessing(leaderboardTeamsTied);

  finishedGames.forEach((finishedGame) => {
    if (
      teamsTiedId.includes(finishedGame.team1.id) &&
      teamsTiedId.includes(finishedGame.team2.id)
    ) {
      const currentLeaderboardTeam1 = leaderboardTeamGameWins.find(
        (headToHeadTeam) => headToHeadTeam.teamId === finishedGame.team1.id,
      )!;
      const currentLeaderboardTeam2 = leaderboardTeamGameWins.find(
        (headToHeadTeam) => headToHeadTeam.teamId === finishedGame.team2.id,
      )!;
      finishedGame.matches.forEach((match) => {
        if (match.matchState === MatchState.team1Win) {
          currentLeaderboardTeam1.numberOfWins += 1;
        } else if (match.matchState === MatchState.team2Win) {
          currentLeaderboardTeam2.numberOfWins += 1;
        }
      });
    }
  });
  leaderboardTeamGameWins.sort((a, b) => b.numberOfWins - a.numberOfWins);

  return sortResolvedTeamsInACheck(
    leaderboardTeamGameWins,
    'numberOfWins',
    'teamId',
  );
};

const resolveWithMatchMarginCheck = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
): ResolvedTieBreaks => {
  const { leaderboardTeamGameWins, teamsTiedId } =
    prepareTiedTeamsForProcessing(leaderboardTeamsTied);

  finishedGames.forEach((finishedGame) => {
    if (teamsTiedId.includes(finishedGame.team1.id)) {
      const currentLeaderboardTeam1 = leaderboardTeamGameWins.find(
        (headToHeadTeam) => headToHeadTeam.teamId === finishedGame.team1.id,
      )!;
      finishedGame.matches.forEach((match) => {
        currentLeaderboardTeam1.matchMargin += match.team1Margin;
      });
    }
    if (teamsTiedId.includes(finishedGame.team2.id)) {
      const currentLeaderboardTeam2 = leaderboardTeamGameWins.find(
        (headToHeadTeam) => headToHeadTeam.teamId === finishedGame.team2.id,
      )!;
      finishedGame.matches.forEach((match) => {
        currentLeaderboardTeam2.matchMargin += match.team2Margin;
      });
    }
  });
  leaderboardTeamGameWins.sort((a, b) => b.matchMargin - a.matchMargin);

  return sortResolvedTeamsInACheck(
    leaderboardTeamGameWins,
    'matchMargin',
    'teamId',
  );
};

const resolveTiedTeamsWithTieBreakCheck = (
  tieBreakCheck: TieResolveCheck,
  tiedTeams: LeaderboardTeam[],
  finishedGames: Game[],
  tournamentSettings: TournamentSettings,
) => {
  switch (tieBreakCheck) {
    case TieResolveCheck.HeadToHead: {
      return resolveWithHeadToHeadCheck(tiedTeams, finishedGames);
    }
    case TieResolveCheck.NumberOfPoints: {
      return resolveWithHighestNumberOfPointsCheck();
    }
    case TieResolveCheck.NumberOfCleanGames: {
      return resolveWithHighestNumberOfCleanGamesCheck(
        tiedTeams,
        finishedGames,
        tournamentSettings,
      );
    }
    case TieResolveCheck.NumberOfMatchesWonInTiedGames: {
      return resolveWithNumberOfMatchesWonInTiedGamesCheck(
        tiedTeams,
        finishedGames,
      );
    }
    case TieResolveCheck.MatchMargin: {
      return resolveWithMatchMarginCheck(tiedTeams, finishedGames);
    }
    case TieResolveCheck.GreatestTimeRemainingAmongAllWonGames:
      return resolveWithMostTimeRemainingCheck(tiedTeams, finishedGames, false);
    case TieResolveCheck.GreatestTimeRemainingAmongTiedWonGames:
      return resolveWithMostTimeRemainingCheck(tiedTeams, finishedGames, true);
    case TieResolveCheck.LeastTimeRemainingAmongAllLostGames:
      return resolveWithLeastTimeRemainingCheck(
        tiedTeams,
        finishedGames,
        false,
      );
    case TieResolveCheck.LeastTimeRemainingAmongTiedLostGames:
      return resolveWithLeastTimeRemainingCheck(tiedTeams, finishedGames, true);
    default: {
      break;
    }
  }
  return NotViableTiebreaker;
};

export const tryToResolveDraws = (
  tiedTeams: LeaderboardTeam[],
  finishedGames: Game[],
  tournamentSettings: TournamentSettings,
) => {
  let teamsTiedLeft = [...tiedTeams];
  let sortingLeaderboardTeams: LeaderboardTeam[] = [];
  for (let j = 0; j < tieBreakChecks.length; j += 1) {
    const tieBreakCheck = tieBreakChecks[j];
    const resolvedTieBreaks = resolveTiedTeamsWithTieBreakCheck(
      tieBreakCheck,
      teamsTiedLeft,
      finishedGames,
      tournamentSettings,
    );
    const { sortedLeaderboardTeam, teamsLeft } = reorderResolvedTies(
      resolvedTieBreaks,
      tiedTeams,
      sortingLeaderboardTeams,
    );
    teamsTiedLeft = [...teamsLeft];
    sortingLeaderboardTeams = [...sortedLeaderboardTeam];
    if (!teamsLeft?.length) {
      break;
    }
    if (j === tieBreakChecks.length - 1) {
      // todo rokpot, maybe this not the best approach
      sortingLeaderboardTeams = [...sortingLeaderboardTeams, ...teamsTiedLeft];
    }
  }

  return sortingLeaderboardTeams;
};

const calculateTournamentRoundRobinLeaderboardPoints = (
  group: TournamentGroup,
  tournamentSettings: TournamentSettings,
  finishedGames: Game[],
) => {
  const leaderboardTeams: LeaderboardTeam[] = [];

  group.teams.forEach((groupTeam) => {
    const newId = v4();
    leaderboardTeams.push(
      new LeaderboardTeam({
        id: newId,
        _id: newId,
        rank: 0,
        team: groupTeam,
        totalLosses: 0,
        totalPoints: 0,
        totalDraws: 0,
        totalWins: 0,
        previousRank: 0,
      }),
    );
  });

  finishedGames.forEach((finishedGame) => {
    const leaderBoardTeam1 = leaderboardTeams.find(
      (team) => team.team.id === finishedGame.team1.id,
    );
    const leaderBoardTeam2 = leaderboardTeams.find(
      (team) => team.team.id === finishedGame.team2.id,
    );

    if (!leaderBoardTeam1 || !leaderBoardTeam2) {
      return;
    }

    switch (finishedGame.gameWinner) {
      case GameWinner.team1: {
        leaderBoardTeam1.totalWins += 1;
        leaderBoardTeam2.totalLosses += 1;

        leaderBoardTeam1.totalPoints += 3;
        break;
      }
      case GameWinner.team2: {
        leaderBoardTeam1.totalLosses += 1;
        leaderBoardTeam2.totalWins += 1;

        leaderBoardTeam2.totalPoints += 3;
        break;
      }
      case GameWinner.draw: {
        leaderBoardTeam1.totalDraws += 1;
        leaderBoardTeam2.totalDraws += 1;

        leaderBoardTeam1.totalPoints += 1;
        leaderBoardTeam2.totalPoints += 1;

        break;
      }

      default: {
        break;
      }
    }
    if (tournamentSettings.shouldInsertMatchMargins) {
      finishedGame.matches.forEach((match) => {
        leaderBoardTeam1.margin += match.team1Margin;
        leaderBoardTeam2.margin += match.team2Margin;
      });
    }
  });
  leaderboardTeams.sort((a, b) => b.totalPoints - a.totalPoints);

  return leaderboardTeams;
};

const prepareLeaderboardTeamsForEliminationsGame = (
  finishedGame: Game,
  isFirstPlacementGame?: boolean,
  isThirdPlacementGame?: boolean,
) => {
  const newId2 = v4();
  const winningTeam =
    finishedGame.gameWinner === GameWinner.team1
      ? finishedGame.team1
      : finishedGame.team2;
  const gameRound = finishedGame.bracketProperties?.round || 1;
  let winningTeamTotalWins = 0;
  let winningTeamTotalLosses = 0;
  let losingTeamTotalWins = 0;
  let losingTeamTotalLosses = 0;
  if (isFirstPlacementGame) {
    winningTeamTotalWins = gameRound;
    winningTeamTotalLosses = 0;
    losingTeamTotalWins = gameRound - 1;
    losingTeamTotalLosses = 1;
  } else if (isThirdPlacementGame) {
    winningTeamTotalWins = gameRound - 1;
    winningTeamTotalLosses = 1;
    losingTeamTotalWins = gameRound - 2;
    losingTeamTotalLosses = 2;
  } else {
    winningTeamTotalWins = gameRound;
    winningTeamTotalLosses = 0;
    losingTeamTotalWins = gameRound - 1;
    losingTeamTotalLosses = 1;
  }

  const winnerLeaderboardTeam = new LeaderboardTeam({
    id: newId2,
    _id: newId2,
    rank: 0,
    team: winningTeam,
    totalLosses: winningTeamTotalLosses,
    totalPoints: 0,
    totalDraws: 0,
    totalWins: winningTeamTotalWins,
    previousRank: ((finishedGame.bracketProperties?.round || 1) - 1) * 3 + 3,
  });

  const losingTeam =
    finishedGame.gameWinner === GameWinner.team1
      ? finishedGame.team2
      : finishedGame.team1;
  const newId = v4();

  const loserLeaderboardTeam = new LeaderboardTeam({
    id: newId,
    _id: newId,
    rank: 0,
    team: losingTeam,
    totalLosses: losingTeamTotalLosses,
    totalPoints: 0,
    totalDraws: 0,
    totalWins: losingTeamTotalWins,
    previousRank: ((finishedGame.bracketProperties?.round || 1) - 1) * 3,
  });

  return { winnerLeaderboardTeam, loserLeaderboardTeam };
};

const calculateSingleEliminationsPoints = (finishedGames: Game[]) => {
  const leaderboardTeams: LeaderboardTeam[] = [];

  const finishedGamesReversed = [...finishedGames];
  finishedGamesReversed.reverse();

  const firstPlaceGameIndex = finishedGamesReversed.findIndex(
    (game) => game.bracketProperties?.isFirstPlaceGame,
  );
  if (firstPlaceGameIndex >= 0) {
    const firstPlaceGame = finishedGamesReversed[firstPlaceGameIndex];
    const { loserLeaderboardTeam, winnerLeaderboardTeam } =
      prepareLeaderboardTeamsForEliminationsGame(firstPlaceGame, true, false);
    leaderboardTeams.push(winnerLeaderboardTeam, loserLeaderboardTeam);

    finishedGamesReversed.splice(firstPlaceGameIndex, 1);
  }

  const thirdPlaceGameIndex = finishedGamesReversed.findIndex(
    (game) => game.bracketProperties?.isThridPlaceGame,
  );
  if (thirdPlaceGameIndex >= 0) {
    const firstPlaceGame = finishedGamesReversed[thirdPlaceGameIndex];
    const { loserLeaderboardTeam, winnerLeaderboardTeam } =
      prepareLeaderboardTeamsForEliminationsGame(firstPlaceGame, false, true);
    leaderboardTeams.push(winnerLeaderboardTeam, loserLeaderboardTeam);

    finishedGamesReversed.splice(thirdPlaceGameIndex, 1);
  }
  const processedTeams = [
    ...leaderboardTeams.map((ldbTeam) => ldbTeam.team.id),
  ];
  finishedGamesReversed.forEach((finishedGame) => {
    const { loserLeaderboardTeam, winnerLeaderboardTeam } =
      prepareLeaderboardTeamsForEliminationsGame(finishedGame, false, false);
    if (finishedGamesReversed?.length < 4) {
      if (!processedTeams.includes(winnerLeaderboardTeam.team.id)) {
        leaderboardTeams.push(winnerLeaderboardTeam);
        processedTeams.push(winnerLeaderboardTeam.team.id);
      }
    }
    if (!processedTeams.includes(loserLeaderboardTeam.team.id)) {
      leaderboardTeams.push(loserLeaderboardTeam);
      processedTeams.push(loserLeaderboardTeam.team.id);
    }
  });

  return leaderboardTeams;
};

const checkAndResolveLeaderboardDraws = (
  leaderboardTeams: LeaderboardTeam[],
  finishedGames: Game[],
  tournamentSettings: TournamentSettings,
) => {
  const leaderboardTeamsSorted: LeaderboardTeam[] = [];
  for (let i = 0; i < leaderboardTeams.length; ) {
    const currentLeaderboardTeam = leaderboardTeams[i];
    const tiedLeaderboardTeams = leaderboardTeams.filter(
      (team) => team.totalPoints === currentLeaderboardTeam.totalPoints,
    );
    if (tiedLeaderboardTeams?.length > 1) {
      const resolvedDraws = tryToResolveDraws(
        tiedLeaderboardTeams,
        finishedGames,
        tournamentSettings,
      );
      leaderboardTeamsSorted.push(...resolvedDraws);
      i += tiedLeaderboardTeams.length;
    } else {
      leaderboardTeamsSorted.push(currentLeaderboardTeam);
      i += 1;
    }
  }
  return leaderboardTeamsSorted;
};

const calculateTournamentRoundRobinLeaderboard = (
  group: TournamentGroup,
  tournamentSettings: TournamentSettings,
  finishedGames: Game[],
) => {
  const leaderboardTeams = calculateTournamentRoundRobinLeaderboardPoints(
    group,
    tournamentSettings,
    finishedGames,
  );

  const sortedLeaderboardTeams = checkAndResolveLeaderboardDraws(
    leaderboardTeams,
    group.finishedGames,
    tournamentSettings,
  );

  // set proper rankings
  return recalculateRankings(sortedLeaderboardTeams);
};

export const calculateTournamentSingleEliminationLeaderboard = (
  group: TournamentGroup,
) => {
  const leaderboardTeams = calculateSingleEliminationsPoints(
    group.finishedGames,
  );

  return recalculateRankings(leaderboardTeams);
};

export const calculateTournamentGroupLeaderboard = (
  group: TournamentGroup,
  tournamentSettings: TournamentSettings,
) => {
  // Calculate team points for a group.
  // WIN - 3 POINTS
  // DRAW - 1 POINT
  // LOSE - 0 POINTS
  switch (group.groupType) {
    case TournamentType.singleElimination:
      return calculateTournamentSingleEliminationLeaderboard(group);
    case TournamentType.roundRobin:
    default: {
      return calculateTournamentRoundRobinLeaderboard(
        group,
        tournamentSettings,
        group.finishedGames,
      );
    }
  }
};

export const calculateTournamentLeaderboard = (tournament?: Tournament) => {
  if (!tournament) {
    return [];
  }

  const leaderboard: LeaderboardTeam[] = [];
  const teamsProcessed: string[] = [];

  for (let i = tournament?.state.stage || 1; i > 0; i -= 1) {
    const selectedStage = tournament?.stages?.find(
      (stage) => stage.stage === i,
    );
    if (selectedStage?.groups) {
      const selectedStageLeaderboard: LeaderboardTeam[] = [];
      selectedStage.groups?.forEach((group) =>
        selectedStageLeaderboard.push(
          ...calculateTournamentGroupLeaderboard(group, tournament!.settings),
        ),
      );
      const filteredAndSortedSelectedStageLeaderboard = selectedStageLeaderboard
        .filter(
          (leaderboardTeam) =>
            !teamsProcessed.includes(leaderboardTeam.team.id),
        )
        .sort((a, b) => b.totalPoints - a.totalPoints);

      leaderboard.push(...filteredAndSortedSelectedStageLeaderboard);

      teamsProcessed.push(
        ...(selectedStage?.groups
          ?.map((group) => group.teams.map((team) => team.id))
          .flat() || []),
      );
    }
  }
  leaderboard.forEach((team, index) => {
    team.rank = index + 1;
  });
  return leaderboard;
};
