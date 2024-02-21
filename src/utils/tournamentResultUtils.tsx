import Game from 'types/Game';
import { GameState, GameWinner } from 'types/GameState';
import LeaderboardTeam from 'types/LeadeboardTeam';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentSettings } from 'types/TournamentSettings';
import { v4 } from 'uuid';

const NotViableTiebreaker = 'notViableTieBreaker';

enum TieBreakCheckings {
  HeadToHead = 'headToHead',
  NumberOfPoints = 'numberOfPoints',
  NumberOfMatchesWonInTiedGames = 'numberOfMatchesWonInTiedGames',
  MatchMargin = 'matchMargin',
  GreatestTimeRemainingAmongAllWonGames = 'greatestTimeRemainingAmongAllWonGames',
  GreatestTimeRemainingAmongTiedWonGames = 'greatestTimeRemainingAmongTiedWonGames',
  LeastTimeRemainingAmongAllLostGames = 'leastTimeRemainingAmongAllLostGames',
  LeastTimeRemainingAmongTiedLostGames = 'leastTimeRemainingAmongTiedLostGames',
}
const tieBreakChecks: TieBreakCheckings[] = [
  TieBreakCheckings.HeadToHead,
  TieBreakCheckings.NumberOfMatchesWonInTiedGames,
  TieBreakCheckings.MatchMargin,
  TieBreakCheckings.GreatestTimeRemainingAmongAllWonGames,
  TieBreakCheckings.GreatestTimeRemainingAmongTiedWonGames,
  TieBreakCheckings.LeastTimeRemainingAmongAllLostGames,
  TieBreakCheckings.LeastTimeRemainingAmongTiedLostGames,
];

interface ResolvedTiedTeam {
  rank: number;
  teamId: string;
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
  currentRank: number,
  resolvedTiedTeams: 'notViableTieBreaker' | ResolvedTiedTeam[],
  tiedLeaderboardTeams: LeaderboardTeam[],
) => {
  if (resolvedTiedTeams === 'notViableTieBreaker') {
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
      const teamToBeReplaced = tiedLeaderboardTeams.find(
        (leaderboardTeam) =>
          leaderboardTeam.team.id === resolvedTiedTeams[t].teamId,
      )!;
      sortedLeaderboardTeam.splice(currentIndexToReplace, 1, teamToBeReplaced);
    } else {
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

export const checkForHeadToHeadTiebreaker = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
): ResolvedTieBreaks => {
  const leaderBoardHeadToHeadWins: { teamId: string; numberOfWins: number }[] =
    [];
  for (let j = 0; j < leaderboardTeamsTied.length; j += 1) {
    leaderBoardHeadToHeadWins.push({
      teamId: leaderboardTeamsTied[j].team.id,
      numberOfWins: 0,
    });
  }

  for (let j = 0; j < leaderboardTeamsTied.length; j += 1) {
    const currentTeam = leaderboardTeamsTied[j];
    for (let s = j + 1; s < leaderboardTeamsTied.length; s += 1) {
      const nextTeam = leaderboardTeamsTied[j + 1];
      const gameWhereTheTwoTeamsMet = finishedGames.find(
        (game) =>
          [currentTeam.team.id, nextTeam.team.id].includes(game.team1.id) &&
          [currentTeam.team.id, nextTeam.team.id].includes(game.team2.id),
      );

      if (gameWhereTheTwoTeamsMet) {
        if (gameWhereTheTwoTeamsMet.gameWinner === GameWinner.team1) {
          const winningLeaderboardTeam =
            gameWhereTheTwoTeamsMet.team1.id === currentTeam.team.id
              ? currentTeam
              : nextTeam;
          const currentHeadToHeadTeam = leaderBoardHeadToHeadWins.find(
            (headToHeadTeam) =>
              headToHeadTeam.teamId === winningLeaderboardTeam.team.id,
          );
          currentHeadToHeadTeam!.numberOfWins += 1;
        } else if (gameWhereTheTwoTeamsMet.gameWinner === GameWinner.team2) {
          const winningLeaderboardTeam =
            gameWhereTheTwoTeamsMet.team2.id === currentTeam.team.id
              ? currentTeam
              : nextTeam;
          const currentHeadToHeadTeam = leaderBoardHeadToHeadWins.find(
            (headToHeadTeam) =>
              headToHeadTeam.teamId === winningLeaderboardTeam.team.id,
          );
          currentHeadToHeadTeam!.numberOfWins =
            currentHeadToHeadTeam!.numberOfWins + 1;
        }
      }
    }
  }
  leaderBoardHeadToHeadWins.sort((a, b) => b.numberOfWins - a.numberOfWins);
  // to do rok pot this is not correct
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

export const checkForLeastTimeRemainingTiebreaker = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
  checkOnlyTiedGames: boolean,
): ResolvedTieBreaks => {
  const leaderBoardTeamGameTimes: {
    teamId: string;
    gameTimeRemaining: number;
    numberOfGamesPlayed: number;
  }[] = [];

  for (let j = 0; j < leaderboardTeamsTied.length; j += 1) {
    leaderBoardTeamGameTimes.push({
      teamId: leaderboardTeamsTied[j].team.id,
      gameTimeRemaining: 0,
      numberOfGamesPlayed: 0,
    });
  }
  const teamsTiedId = leaderboardTeamsTied.map(
    (leaderboardTiedTeam) => leaderboardTiedTeam.team.id,
  );
  finishedGames.forEach((finishedGame) => {
    if (!checkOnlyTiedGames) {
      if (finishedGame.gameWinner === GameWinner.team2) {
        if (teamsTiedId.includes(finishedGame.team1.id)) {
          const leaderBoardTeamTime = leaderBoardTeamGameTimes.find(
            (leaderBoardTeamGameTime) =>
              leaderBoardTeamGameTime.teamId === finishedGame.team1.id,
          )!;
          leaderBoardTeamTime.numberOfGamesPlayed =
            leaderBoardTeamTime.gameTimeRemaining + 1;
          leaderBoardTeamTime.gameTimeRemaining =
            (leaderBoardTeamTime.gameTimeRemaining + finishedGame.gameTime) /
            leaderBoardTeamTime.numberOfGamesPlayed;
        }
      }
      if (finishedGame.gameWinner === GameWinner.team1) {
        if (teamsTiedId.includes(finishedGame.team2.id)) {
          const leaderBoardTeamTime = leaderBoardTeamGameTimes.find(
            (leaderBoardTeamGameTime) =>
              leaderBoardTeamGameTime.teamId === finishedGame.team2.id,
          )!;
          leaderBoardTeamTime.numberOfGamesPlayed =
            leaderBoardTeamTime.gameTimeRemaining + 1;
          leaderBoardTeamTime.gameTimeRemaining =
            (leaderBoardTeamTime.gameTimeRemaining + finishedGame.gameTime) /
            leaderBoardTeamTime.numberOfGamesPlayed;
        }
      }
      return;
    }

    // Check head to head games to do rokpot
    if (
      teamsTiedId.includes(finishedGame.team1.id) &&
      teamsTiedId.includes(finishedGame.team2.id)
    ) {
      if (finishedGame.gameWinner === GameWinner.team2) {
        if (teamsTiedId.includes(finishedGame.team1.id)) {
          const leaderBoardTeamTime = leaderBoardTeamGameTimes.find(
            (leaderBoardTeamGameTime) =>
              leaderBoardTeamGameTime.teamId === finishedGame.team1.id,
          )!;
          leaderBoardTeamTime.numberOfGamesPlayed =
            leaderBoardTeamTime.gameTimeRemaining + 1;
          leaderBoardTeamTime.gameTimeRemaining =
            (leaderBoardTeamTime.gameTimeRemaining + finishedGame.gameTime) /
            leaderBoardTeamTime.numberOfGamesPlayed;
        }
      }
      if (finishedGame.gameWinner === GameWinner.team1) {
        if (teamsTiedId.includes(finishedGame.team2.id)) {
          const leaderBoardTeamTime = leaderBoardTeamGameTimes.find(
            (leaderBoardTeamGameTime) =>
              leaderBoardTeamGameTime.teamId === finishedGame.team2.id,
          )!;
          leaderBoardTeamTime.numberOfGamesPlayed =
            leaderBoardTeamTime.gameTimeRemaining + 1;
          leaderBoardTeamTime.gameTimeRemaining =
            (leaderBoardTeamTime.gameTimeRemaining + finishedGame.gameTime) /
            leaderBoardTeamTime.numberOfGamesPlayed;
        }
      }
    }
  });

  leaderBoardTeamGameTimes.sort(
    (a, b) => b.gameTimeRemaining - a.gameTimeRemaining,
  );

  const sortedTeams: { rank: number; teamId: string }[] = [];
  for (let i = 0; i < leaderBoardTeamGameTimes.length; i += 1) {
    const previousHeadToHeadWins = leaderBoardTeamGameTimes[i - 1];
    const currentHeadToHeadWins = leaderBoardTeamGameTimes[i];
    const nextHeadToHeadWins = leaderBoardTeamGameTimes[i + 1];
    if (
      (!previousHeadToHeadWins ||
        previousHeadToHeadWins?.gameTimeRemaining !==
          currentHeadToHeadWins.gameTimeRemaining) &&
      (!nextHeadToHeadWins ||
        nextHeadToHeadWins?.gameTimeRemaining !==
          currentHeadToHeadWins.gameTimeRemaining)
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
  const leaderBoardTeamGameTimes: {
    teamId: string;
    gameTimeRemaining: number;
    numberOfGamesPlayed: number;
  }[] = [];

  for (let j = 0; j < leaderboardTeamsTied.length; j += 1) {
    leaderBoardTeamGameTimes.push({
      teamId: leaderboardTeamsTied[j].team.id,
      gameTimeRemaining: 0,
      numberOfGamesPlayed: 0,
    });
  }
  const teamsTiedId = leaderboardTeamsTied.map(
    (leaderboardTiedTeam) => leaderboardTiedTeam.team.id,
  );
  finishedGames.forEach((finishedGame) => {
    if (!checkOnlyTiedGames) {
      if (finishedGame.gameWinner === GameWinner.team1) {
        if (teamsTiedId.includes(finishedGame.team1.id)) {
          const leaderBoardTeamTime = leaderBoardTeamGameTimes.find(
            (leaderBoardTeamGameTime) =>
              leaderBoardTeamGameTime.teamId === finishedGame.team1.id,
          )!;
          leaderBoardTeamTime.numberOfGamesPlayed =
            leaderBoardTeamTime.gameTimeRemaining + 1;
          leaderBoardTeamTime.gameTimeRemaining =
            (leaderBoardTeamTime.gameTimeRemaining + finishedGame.gameTime) /
            leaderBoardTeamTime.numberOfGamesPlayed;
        }
      }
      if (finishedGame.gameWinner === GameWinner.team2) {
        if (teamsTiedId.includes(finishedGame.team2.id)) {
          const leaderBoardTeamTime = leaderBoardTeamGameTimes.find(
            (leaderBoardTeamGameTime) =>
              leaderBoardTeamGameTime.teamId === finishedGame.team2.id,
          )!;
          leaderBoardTeamTime.numberOfGamesPlayed =
            leaderBoardTeamTime.gameTimeRemaining + 1;
          leaderBoardTeamTime.gameTimeRemaining =
            (leaderBoardTeamTime.gameTimeRemaining + finishedGame.gameTime) /
            leaderBoardTeamTime.numberOfGamesPlayed;
        }
      }
      return;
    }

    // Check head to head games to do rokpot
    if (
      teamsTiedId.includes(finishedGame.team1.id) &&
      teamsTiedId.includes(finishedGame.team2.id)
    ) {
      if (finishedGame.gameWinner === GameWinner.team1) {
        if (teamsTiedId.includes(finishedGame.team1.id)) {
          const leaderBoardTeamTime = leaderBoardTeamGameTimes.find(
            (leaderBoardTeamGameTime) =>
              leaderBoardTeamGameTime.teamId === finishedGame.team1.id,
          )!;
          leaderBoardTeamTime.numberOfGamesPlayed =
            leaderBoardTeamTime.gameTimeRemaining + 1;
          leaderBoardTeamTime.gameTimeRemaining =
            (leaderBoardTeamTime.gameTimeRemaining + finishedGame.gameTime) /
            leaderBoardTeamTime.numberOfGamesPlayed;
        }
      }
      if (finishedGame.gameWinner === GameWinner.team2) {
        if (teamsTiedId.includes(finishedGame.team2.id)) {
          const leaderBoardTeamTime = leaderBoardTeamGameTimes.find(
            (leaderBoardTeamGameTime) =>
              leaderBoardTeamGameTime.teamId === finishedGame.team2.id,
          )!;
          leaderBoardTeamTime.numberOfGamesPlayed =
            leaderBoardTeamTime.gameTimeRemaining + 1;
          leaderBoardTeamTime.gameTimeRemaining =
            (leaderBoardTeamTime.gameTimeRemaining + finishedGame.gameTime) /
            leaderBoardTeamTime.numberOfGamesPlayed;
        }
      }
    }
  });

  leaderBoardTeamGameTimes.sort(
    (a, b) => b.gameTimeRemaining - a.gameTimeRemaining,
  );

  const sortedTeams: { rank: number; teamId: string }[] = [];
  for (let i = 0; i < leaderBoardTeamGameTimes.length; i += 1) {
    const previousHeadToHeadWins = leaderBoardTeamGameTimes[i - 1];
    const currentHeadToHeadWins = leaderBoardTeamGameTimes[i];
    const nextHeadToHeadWins = leaderBoardTeamGameTimes[i + 1];
    if (
      (!previousHeadToHeadWins ||
        previousHeadToHeadWins?.gameTimeRemaining !==
          currentHeadToHeadWins.gameTimeRemaining) &&
      (!nextHeadToHeadWins ||
        nextHeadToHeadWins?.gameTimeRemaining !==
          currentHeadToHeadWins.gameTimeRemaining)
    ) {
      sortedTeams.push({ rank: i, teamId: currentHeadToHeadWins.teamId });
    } else {
      sortedTeams.push({ rank: -1, teamId: currentHeadToHeadWins.teamId });
    }
  }

  return sortedTeams;
};

const calculateTieBreakChecking = (
  tieBreakCheck: TieBreakCheckings,
  tiedTeams: LeaderboardTeam[],
  finishedGames: Game[],
) => {
  switch (tieBreakCheck) {
    case TieBreakCheckings.HeadToHead: {
      return checkForHeadToHeadTiebreaker(tiedTeams, finishedGames);
    }
    case TieBreakCheckings.NumberOfPoints: {
      break;
    }
    case TieBreakCheckings.MatchMargin: {
      break;
    }
    case TieBreakCheckings.GreatestTimeRemainingAmongAllWonGames:
      return checkForGreatestTimeRemainingTiebreaker(
        tiedTeams,
        finishedGames,
        false,
      );
    case TieBreakCheckings.GreatestTimeRemainingAmongTiedWonGames:
      return checkForGreatestTimeRemainingTiebreaker(
        tiedTeams,
        finishedGames,
        true,
      );
    case TieBreakCheckings.LeastTimeRemainingAmongAllLostGames:
      return checkForLeastTimeRemainingTiebreaker(
        tiedTeams,
        finishedGames,
        false,
      );
    case TieBreakCheckings.LeastTimeRemainingAmongTiedLostGames:
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
  currentRank: number,
  tiedTeams: LeaderboardTeam[],
  finishedGames: Game[],
) => {
  let teamsTiedLeft = [...tiedTeams];
  let sortingLeaderboardTeams: LeaderboardTeam[] = [];
  for (let j = 0; j < tieBreakChecks.length; j += 1) {
    const tieBreakCheck = tieBreakChecks[j];
    const resolvedTieBreaks = calculateTieBreakChecking(
      tieBreakCheck,
      teamsTiedLeft,
      finishedGames,
    );
    const { sortedLeaderboardTeam, teamsLeft } = reorderSortedTiedTeams(
      currentRank,
      resolvedTieBreaks,
      tiedTeams,
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
  for (let i = 0; i < leaderboardTeams.length; i += 1) {
    const currentLeaderboardTeam = leaderboardTeams[i];
    const leaderboardTeamsTiedToTheCurrentOne = leaderboardTeams.filter(
      (leaderboardTeam) =>
        leaderboardTeam.totalPoints === currentLeaderboardTeam.totalPoints,
    );
    if (leaderboardTeamsTiedToTheCurrentOne?.length > 1) {
      const resolvedDraws = tryToResolveDraws(
        i,
        leaderboardTeamsTiedToTheCurrentOne,
        finishedGames,
      );
      leaderboardTeamsSorted.push(...resolvedDraws);
      i += leaderboardTeamsTiedToTheCurrentOne.length;
    } else {
      leaderboardTeamsSorted.push(currentLeaderboardTeam);
    }
  }
  return leaderboardTeamsSorted;
};

export const calculateTournamentGroupLeaderboard = (
  group: TournamentGroup,
  tournamentSettings: TournamentSettings,
) => {
  const finishedGames = group.games.filter(
    (game) => game.gameState === GameState.finished,
  );

  // Calculate team points for a group.
  // WIN - 3 POINTS
  // DRAW - 1 POINT
  // LOSE - 0 POINTS
  const leaderboardTeams = calculateTournamentGroupPoints(
    group,
    tournamentSettings,
    finishedGames,
  );

  // If there are any teams that are tied (same points), we need to try to resolve them
  const sortedLeaderboardTeams = checkAndResolveLeaderboardDraws(
    leaderboardTeams,
    finishedGames,
  );

  // set proper rankings
  return recalculateRankings(sortedLeaderboardTeams);
};
