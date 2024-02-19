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
  leaderboardTeams: LeaderboardTeam[],
) => {
  if (resolvedTiedTeams === 'notViableTieBreaker') {
    return {
      teamsLeft: tiedLeaderboardTeams,
      sortedLeaderboardTeam: leaderboardTeams,
    };
  }
  let currentIndex = currentRank;
  const teamsTiedLeft = [];
  for (
    let currentIndexToReplace = currentIndex, t = 0;
    t < resolvedTiedTeams.length;
    t += 1, currentIndexToReplace += 1
  ) {
    if (resolvedTiedTeams[t].rank !== -1) {
      const teamToBeReplaced = tiedLeaderboardTeams.find(
        (leaderboardTeam) => leaderboardTeam.id === resolvedTiedTeams[t].teamId,
      )!;
      leaderboardTeams.splice(currentIndexToReplace, 1, teamToBeReplaced);
      currentIndex += 1;
    } else {
      const teamNotResolved = tiedLeaderboardTeams.find(
        (leaderboardTeam) => leaderboardTeam.id === resolvedTiedTeams[t].teamId,
      )!;
      teamsTiedLeft.push(teamNotResolved);
    }
  }
  return {
    teamsLeft: teamsTiedLeft,
    sortedLeaderboardTeam: tiedLeaderboardTeams,
  };
};

export const checkForNumberOfMatchesWonTiebreaker = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
): LeaderboardTeam[] | typeof NotViableTiebreaker => {
  const leaderboardTeamScores: { teamId: string; numberOfMatchWins: number }[] =
    [];
  // TO DO: RokPot - Not sure what to do here.
  for (let j = 0; j < leaderboardTeamsTied.length; j += 1) {
    leaderboardTeamScores.push({
      teamId: leaderboardTeamsTied[j].id,
      numberOfMatchWins: 0,
    });
  }
  const teamIds = leaderboardTeamsTied.map(
    (leaderboardTeam) => leaderboardTeam.id,
  );
  finishedGames.forEach((finishedGame) => {
    // If team 1 has won, check if team 1 is in the teamIds
    if (finishedGame.gameWinner === GameWinner.team1) {
      if (teamIds.includes(finishedGame.team1.id)) {
        const leaderboardTeamScore = leaderboardTeamScores.find(
          (internalLeaderboardTeamScore) =>
            internalLeaderboardTeamScore.teamId === finishedGame.team1.id,
        )!;
        leaderboardTeamScore.numberOfMatchWins =
          (leaderboardTeamScore.numberOfMatchWins || 0) + 1;
      }
    } else if (finishedGame.gameWinner === GameWinner.team2) {
      if (teamIds.includes(finishedGame.team2.id)) {
        const leaderboardTeamScore = leaderboardTeamScores.find(
          (internalLeaderboardTeamScore) =>
            internalLeaderboardTeamScore.teamId === finishedGame.team2.id,
        )!;
        leaderboardTeamScore.numberOfMatchWins =
          (leaderboardTeamScore.numberOfMatchWins || 0) + 1;
      }
    }
  });

  return NotViableTiebreaker;
};

export const checkForHeadToHeadTiebreaker = (
  leaderboardTeamsTied: LeaderboardTeam[],
  finishedGames: Game[],
): { rank: number; teamId: string }[] | typeof NotViableTiebreaker => {
  const leaderBoardHeadToHeadWins: { teamId: string; numberOfWins: number }[] =
    [];
  for (let j = 0; j < leaderboardTeamsTied.length; j += 1) {
    leaderBoardHeadToHeadWins.push({
      teamId: leaderboardTeamsTied[j].id,
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
          const winningTeam =
            gameWhereTheTwoTeamsMet.team1.id === currentTeam.id
              ? currentTeam
              : nextTeam;
          const currentHeadToHeadTeam = leaderBoardHeadToHeadWins.find(
            (headToHeadTeam) => headToHeadTeam.teamId === winningTeam.id,
          );
          currentHeadToHeadTeam!.numberOfWins =
            (currentHeadToHeadTeam?.numberOfWins || 0) + 1;
        } else if (gameWhereTheTwoTeamsMet.gameWinner === GameWinner.team2) {
          const winningTeam =
            gameWhereTheTwoTeamsMet.team2.id === currentTeam.id
              ? currentTeam
              : nextTeam;
          const currentHeadToHeadTeam = leaderBoardHeadToHeadWins.find(
            (headToHeadTeam) => headToHeadTeam.teamId === winningTeam.id,
          );
          currentHeadToHeadTeam!.numberOfWins =
            (currentHeadToHeadTeam?.numberOfWins || 0) + 1;
        }
      }
    }
  }
  leaderBoardHeadToHeadWins.sort((a, b) => a.numberOfWins - b.numberOfWins);
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

export const calculateTournamentGroupLeaderboard = (
  group: TournamentGroup,
  tournamentSettings: TournamentSettings,
) => {
  const finishedGames = group.games.filter(
    (game) => game.gameState === GameState.finished,
  );
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

  const leaderboardTeamsSorted: LeaderboardTeam[] = [...leaderboardTeams];
  for (let i = 0; i < leaderboardTeams.length; i += 1) {
    const currentLeaderboardTeam = leaderboardTeams[i];
    const leaderboardTeamsTiedToTheCurrentOne = leaderboardTeams.filter(
      (leaderboardTeam) =>
        leaderboardTeam.totalPoints === currentLeaderboardTeam.totalPoints,
    );
    if (leaderboardTeamsTiedToTheCurrentOne?.length > 1) {
      // Check Head-To-Head games
      let teamsTiedLeft = [...leaderboardTeamsTiedToTheCurrentOne];

      for (let j = 0; j < tieBreakChecks.length; j += 1) {
        const tieBreakCheck = tieBreakChecks[j];
        if (tieBreakCheck === TieBreakCheckings.HeadToHead) {
          const headForHeadResolved = checkForHeadToHeadTiebreaker(
            teamsTiedLeft,
            finishedGames,
          );
          const {} = reorderSortedTiedTeams(
            i,
            headForHeadResolved,
            leaderboardTeams,
          );
          if (headForHeadResolved !== NotViableTiebreaker) {
            if (teamsTiedLeft?.length <= 0) {
              break;
            }
          }
        }
      }
    }
  }
  // for (let i = 0; i < leaderboardTeams.length; i += 1) {
  //   const currentTeam = leaderboardTeams[i];
  //   for (let j = i + 1; j < leaderboardTeams.length; j += 1) {
  //     const nextTeam = leaderboardTeams[j];
  // if (currentTeam.totalPoints === nextTeam.totalPoints) {
  //   const gameWhereTheTwoTeamsMet = finishedGames.find(
  //     (game) =>
  //       [currentTeam.team.id, nextTeam.team.id].includes(game.team1.id) &&
  //       [currentTeam.team.id, nextTeam.team.id].includes(game.team2.id),
  //   );

  //   if (gameWhereTheTwoTeamsMet) {
  //     if (gameWhereTheTwoTeamsMet.gameWinner === GameWinner.team1) {
  //       // DO nothing team 1 is good
  //     } else if (
  //       gameWhereTheTwoTeamsMet.gameWinner === GameWinner.team2
  //     ) {
  //       // Swap
  //       leaderboardTeamsSorted = [
  //         ...swapElements(leaderboardTeamsSorted, i, j),
  //       ];
  //     } else if (gameWhereTheTwoTeamsMet.gameWinner === GameWinner.draw) {
  //       let team1GameMargin = 0;
  //       let team2GameMargin = 0;
  //       gameWhereTheTwoTeamsMet.matches.forEach((match) => {
  //         team1GameMargin += match.team1Margin;
  //         team2GameMargin += match.team2Margin;
  //       });
  //       if (team2GameMargin > team1GameMargin) {
  //         leaderboardTeamsSorted = [
  //           ...swapElements(leaderboardTeamsSorted, i, j),
  //         ];
  //       }
  //     }
  //       } else if (nextTeam.margin > currentTeam.margin) {
  //         leaderboardTeamsSorted = [
  //           ...swapElements(leaderboardTeamsSorted, i, j),
  //         ];
  //       }
  //     }
  //   }
  // }

  // set proper rankings
  return recalculateRankings(leaderboardTeamsSorted);
};
