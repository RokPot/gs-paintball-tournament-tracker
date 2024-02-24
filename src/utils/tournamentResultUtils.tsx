import Game from 'types/Game';
import { GameWinner } from 'types/GameState';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentSettings } from 'types/TournamentSettings';
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

interface LeaderboardTeamGameTime {
  teamId: string;
  gameTimeRemainingSum: number;
  numberOfGamesPlayed: number;
}

interface LeaderboardTeamGameWins {
  teamId: string;
  numberOfWins: number;
}

type ResolvedTieBreaks = ResolvedTiedTeam[] | typeof NotViableTiebreaker;

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

export const reorderSortedTiedTeams = (
  resolvedTiedTeams: ResolvedTieBreaks,
  tiedLeaderboardTeams: LeaderboardTeam[],
) => {
  if (resolvedTiedTeams === NotViableTiebreaker) {
    return {
      teamsLeft: tiedLeaderboardTeams,
      sortedLeaderboardTeam: [],
    };
  }
  const sortedLeaderboardTeam = [...tiedLeaderboardTeams];
  const teamsLeft = [];
  for (
    let currentIndexToReplace = 0, t = 0;
    t < resolvedTiedTeams.length;
    t += 1, currentIndexToReplace += 1
  ) {
    if (resolvedTiedTeams[t].rank !== -1) {
      // If we have a rank we can sort  it
      const teamToBeReplaced = tiedLeaderboardTeams.find(
        (leaderboardTeam) =>
          leaderboardTeam.team.id === resolvedTiedTeams[t].teamId,
      )!;
      sortedLeaderboardTeam.splice(currentIndexToReplace, 1, teamToBeReplaced);
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

export const resolveWithHeadToHeadCheck = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
): ResolvedTieBreaks => {
  const leaderBoardHeadToHeadWins: LeaderboardTeamGameWins[] = [];
  for (let j = 0; j < leaderboardTeamsTied.length; j += 1) {
    leaderBoardHeadToHeadWins.push({
      teamId: leaderboardTeamsTied[j].team.id,
      numberOfWins: 0,
    });
  }

  const teamsTiedId = leaderboardTeamsTied.map(
    (leaderboardTiedTeam) => leaderboardTiedTeam.team.id,
  );

  finishedGames.forEach((finishedGame) => {
    const areBothTeamsInTheGame =
      teamsTiedId.includes(finishedGame.team1.id) &&
      teamsTiedId.includes(finishedGame.team2.id);
    if (!areBothTeamsInTheGame) {
      return;
    }

    if (finishedGame.gameWinner === GameWinner.team1) {
      const currentHeadToHeadTeam = leaderBoardHeadToHeadWins.find(
        (headToHeadTeam) => headToHeadTeam.teamId === finishedGame.team1.id,
      );
      currentHeadToHeadTeam!.numberOfWins += 1;
    } else if (finishedGame.gameWinner === GameWinner.team2) {
      const currentHeadToHeadTeam = leaderBoardHeadToHeadWins.find(
        (headToHeadTeam) => headToHeadTeam.teamId === finishedGame.team2.id,
      );
      currentHeadToHeadTeam!.numberOfWins += 1;
    }
  });

  leaderBoardHeadToHeadWins.sort((a, b) => b.numberOfWins - a.numberOfWins);

  const sortedTeams: { rank: number; teamId: string }[] = [];
  for (let i = 0; i < leaderBoardHeadToHeadWins.length; i += 1) {
    if (
      leaderBoardHeadToHeadWins[i].numberOfWins ===
      leaderBoardHeadToHeadWins.length - i - 1
    ) {
      const previousHeadToHeadWins = leaderBoardHeadToHeadWins[i - 1];
      const currentHeadToHeadWins = leaderBoardHeadToHeadWins[i];
      const nextHeadToHeadWins = leaderBoardHeadToHeadWins[i + 1];
      if (
        (!previousHeadToHeadWins ||
          previousHeadToHeadWins?.numberOfWins !==
            currentHeadToHeadWins.numberOfWins) &&
        (!nextHeadToHeadWins ||
          nextHeadToHeadWins?.numberOfWins !==
            currentHeadToHeadWins.numberOfWins)
      ) {
        sortedTeams.push({ rank: i, teamId: currentHeadToHeadWins.teamId });
      } else {
        sortedTeams.push({ rank: -1, teamId: currentHeadToHeadWins.teamId });
      }
    } else {
      sortedTeams.push({
        rank: -1,
        teamId: leaderBoardHeadToHeadWins[i].teamId,
      });
    }
  }

  return sortedTeams;
};

const findLeaderBoardTeamGameTimeAndAddTime = (
  teamToCheck: Team,
  leaderBoardTeamGameTimes: LeaderboardTeamGameTime[],
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
  let leaderBoardTeamGameTimes: LeaderboardTeamGameTime[] = [];

  for (let j = 0; j < leaderboardTeamsTied.length; j += 1) {
    leaderBoardTeamGameTimes.push({
      teamId: leaderboardTeamsTied[j].team.id,
      gameTimeRemainingSum: 0,
      numberOfGamesPlayed: 0,
    });
  }
  const teamsTiedId = leaderboardTeamsTied.map(
    (leaderboardTiedTeam) => leaderboardTiedTeam.team.id,
  );
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

export const checkForLeastTimeRemainingTiebreaker = (
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

  const sortedTeams: { rank: number; teamId: string }[] = [];
  for (let i = 0; i < leaderBoardTeamGameTimes.length; i += 1) {
    const previousHeadToHeadWins = leaderBoardTeamGameTimes[i - 1];
    const currentHeadToHeadWins = leaderBoardTeamGameTimes[i];
    const nextHeadToHeadWins = leaderBoardTeamGameTimes[i + 1];
    if (
      (!previousHeadToHeadWins ||
        previousHeadToHeadWins?.gameTimeRemainingSum !==
          currentHeadToHeadWins.gameTimeRemainingSum) &&
      (!nextHeadToHeadWins ||
        nextHeadToHeadWins?.gameTimeRemainingSum !==
          currentHeadToHeadWins.gameTimeRemainingSum)
    ) {
      sortedTeams.push({ rank: i, teamId: currentHeadToHeadWins.teamId });
    } else {
      sortedTeams.push({ rank: -1, teamId: currentHeadToHeadWins.teamId });
    }
  }

  return sortedTeams;
};

export const checkForGreatestTimeRemainingTiebreaker = (
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

  const sortedTeams: { rank: number; teamId: string }[] = [];
  for (let i = 0; i < leaderBoardTeamGameTimes.length; i += 1) {
    const previousHeadToHeadWins = leaderBoardTeamGameTimes[i - 1];
    const currentHeadToHeadWins = leaderBoardTeamGameTimes[i];
    const nextHeadToHeadWins = leaderBoardTeamGameTimes[i + 1];
    if (
      (!previousHeadToHeadWins ||
        previousHeadToHeadWins?.gameTimeRemainingSum !==
          currentHeadToHeadWins.gameTimeRemainingSum) &&
      (!nextHeadToHeadWins ||
        nextHeadToHeadWins?.gameTimeRemainingSum !==
          currentHeadToHeadWins.gameTimeRemainingSum)
    ) {
      sortedTeams.push({ rank: i, teamId: currentHeadToHeadWins.teamId });
    } else {
      sortedTeams.push({ rank: -1, teamId: currentHeadToHeadWins.teamId });
    }
  }

  return sortedTeams;
};

const resolveWithHighestNumberOfPointsCheck = (): ResolvedTieBreaks => {
  // TO DO Rokpot
  // Not sure what to do here since same point are why teams are tied
  return NotViableTiebreaker;
};

const resolveWithHighestNumberOfCleanGamesCheck = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
): ResolvedTieBreaks => {
  // TO DO Rokpot
  console.log(leaderboardTeamsTied, finishedGames);
  const leaderBoardTeamGameTimes: LeaderboardTeamGameTime[] = [];

  for (let j = 0; j < leaderboardTeamsTied.length; j += 1) {
    leaderBoardTeamGameTimes.push({
      teamId: leaderboardTeamsTied[j].team.id,
      gameTimeRemainingSum: 0,
      numberOfGamesPlayed: 0,
    });
  }
  // TODO rok pot handle this
  const teamsTiedId = leaderboardTeamsTied.map(
    (leaderboardTiedTeam) => leaderboardTiedTeam.team.id,
  );
  finishedGames.forEach((finishedGame) => {});
  return NotViableTiebreaker;
};

const resolveWithNumberOfMatchesWonInTiedGamesCheck = (): ResolvedTieBreaks => {
  // TO DO Rokpot
  return NotViableTiebreaker;
};

const resolveWithMatchMarginCheck = (): ResolvedTieBreaks => {
  // TO DO Rokpot
  return NotViableTiebreaker;
};

const tryToResolveTiedTeams = (
  tieBreakCheck: TieResolveCheck,
  tiedTeams: LeaderboardTeam[],
  finishedGames: Game[],
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
      );
    }
    case TieResolveCheck.NumberOfMatchesWonInTiedGames: {
      return resolveWithNumberOfMatchesWonInTiedGamesCheck();
    }
    case TieResolveCheck.MatchMargin: {
      return resolveWithMatchMarginCheck();
    }
    case TieResolveCheck.GreatestTimeRemainingAmongAllWonGames:
      return checkForGreatestTimeRemainingTiebreaker(
        tiedTeams,
        finishedGames,
        false,
      );
    case TieResolveCheck.GreatestTimeRemainingAmongTiedWonGames:
      return checkForGreatestTimeRemainingTiebreaker(
        tiedTeams,
        finishedGames,
        true,
      );
    case TieResolveCheck.LeastTimeRemainingAmongAllLostGames:
      return checkForLeastTimeRemainingTiebreaker(
        tiedTeams,
        finishedGames,
        false,
      );
    case TieResolveCheck.LeastTimeRemainingAmongTiedLostGames:
      return checkForLeastTimeRemainingTiebreaker(
        tiedTeams,
        finishedGames,
        true,
      );
    default: {
      break;
    }
  }
  return NotViableTiebreaker;
};

export const tryToResolveDraws = (
  tiedTeams: LeaderboardTeam[],
  finishedGames: Game[],
) => {
  let teamsTiedLeft = [...tiedTeams];
  let sortingLeaderboardTeams: LeaderboardTeam[] = [];

  for (let j = 0; j < tieBreakChecks.length; j += 1) {
    const tieBreakCheck = tieBreakChecks[j];
    const resolvedTieBreaks = tryToResolveTiedTeams(
      tieBreakCheck,
      teamsTiedLeft,
      finishedGames,
    );
    const { sortedLeaderboardTeam, teamsLeft } = reorderSortedTiedTeams(
      resolvedTieBreaks,
      teamsTiedLeft,
    );

    teamsTiedLeft = [...teamsLeft];
    sortingLeaderboardTeams = [...sortedLeaderboardTeam];
    if (!teamsLeft?.length) {
      break;
    }
  }

  return sortingLeaderboardTeams;
};

const calculateTournamentGroupPoints = (
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

const checkAndResolveLeaderboardDraws = (
  leaderboardTeams: LeaderboardTeam[],
  finishedGames: Game[],
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

export const calculateTournamentGroupLeaderboard = (
  group: TournamentGroup,
  tournamentSettings: TournamentSettings,
) => {
  // Calculate team points for a group.
  // WIN - 3 POINTS
  // DRAW - 1 POINT
  // LOSE - 0 POINTS
  const leaderboardTeams = calculateTournamentGroupPoints(
    group,
    tournamentSettings,
    group.finishedGames,
  );

  // If there are any teams that are tied (same points), we need to try to resolve them
  const sortedLeaderboardTeams = checkAndResolveLeaderboardDraws(
    leaderboardTeams,
    group.finishedGames,
  );

  // set proper rankings
  return recalculateRankings(sortedLeaderboardTeams);
};
