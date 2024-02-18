import { Typography } from '@mui/material';
import CustomTabs from 'components/shared/CustomTabs';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useEffect, useState } from 'react';
import { GameState, GameWinner } from 'types/GameState';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import TournamentGroup from 'types/TournamentGroup';
import { v4 } from 'uuid';
import { ReactComponent as EmptyState } from '../../../assets/icons/EmptyInbox.svg';

enum TieBreakCheckings {
  HeadToHead = 'headToHead',
  NumberOfPoints = 'numberOfPoints',
  NumberOfMatchesWon = 'numberOfMatchesWon',
  MatchMargin = 'matchMargin',
  GreatestTimeRemainingAmongAllWonGames = 'greatestTimeRemainingAmongAllWonGames',
  GreatestTimeRemainingAmongTiedWonGames = 'greatestTimeRemainingAmongTiedWonGames',
  LeastTimeRemainingAmongAllLostGames = 'leastTimeRemainingAmongAllLostGames',
  LeastTimeRemainingAmongTiedLostGames = 'leastTimeRemainingAmongTiedLostGames',
}
enum AvailableTieBreaks {
  TieBreakerGames = 'tieBreakerGames',
  Overtime = 'overtime',
}

interface IProps {
  activeLeague: League;
}

const TournamentResults = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;
  const [selectedGroup, setSelectedGroup] = useState(
    selectedTournament?.groups?.[0].id,
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);
  const calculateResults = (group: TournamentGroup) => {
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
      if (selectedTournament?.settings.shouldInsertMatchMargins) {
        finishedGame.matches.forEach((match) => {
          leaderBoardTeam1.margin += match.team1Margin;
          leaderBoardTeam2.margin += match.team2Margin;
        });
      }
    });

    let leaderboardTeamsSorted: LeaderboardTeam[] = [...leaderboardTeams];
    for (let i = 0; i < leaderboardTeams.length; i += 1) {
      const currentLeaderboardTeam = leaderboardTeams[i];
      const leaderboardTeamsTiedToTheCurrentOne = leaderboardTeams.filter(
        (leaderboardTeam) =>
          leaderboardTeam.totalPoints === currentLeaderboardTeam.totalPoints,
      );
      if (leaderboardTeamsTiedToTheCurrentOne?.length > 1) {
        // Check Head-To-Head games
        for (let j = 0; j < leaderboardTeams.length; j += 1) {
          const leaderBoardHeadToHeadWins;
        }
      }
    }
    // for (let i = 0; i < leaderboardTeams.length; i += 1) {
    //   const currentTeam = leaderboardTeams[i];
    //   for (let j = i + 1; j < leaderboardTeams.length; j += 1) {
    //     const nextTeam = leaderboardTeams[j];
    //     if (currentTeam.totalPoints === nextTeam.totalPoints) {
    //       const gameWhereTheTwoTeamsMet = finishedGames.find(
    //         (game) =>
    //           [currentTeam.team.id, nextTeam.team.id].includes(game.team1.id) &&
    //           [currentTeam.team.id, nextTeam.team.id].includes(game.team2.id),
    //       );

    //       if (gameWhereTheTwoTeamsMet) {
    //         if (gameWhereTheTwoTeamsMet.gameWinner === GameWinner.team1) {
    //           // DO nothing team 1 is good
    //         } else if (
    //           gameWhereTheTwoTeamsMet.gameWinner === GameWinner.team2
    //         ) {
    //           // Swap
    //           leaderboardTeamsSorted = [
    //             ...swapElements(leaderboardTeamsSorted, i, j),
    //           ];
    //         } else if (gameWhereTheTwoTeamsMet.gameWinner === GameWinner.draw) {
    //           let team1GameMargin = 0;
    //           let team2GameMargin = 0;
    //           gameWhereTheTwoTeamsMet.matches.forEach((match) => {
    //             team1GameMargin += match.team1Margin;
    //             team2GameMargin += match.team2Margin;
    //           });
    //           if (team2GameMargin > team1GameMargin) {
    //             leaderboardTeamsSorted = [
    //               ...swapElements(leaderboardTeamsSorted, i, j),
    //             ];
    //           }
    //         }
    //       } else if (nextTeam.margin > currentTeam.margin) {
    //         leaderboardTeamsSorted = [
    //           ...swapElements(leaderboardTeamsSorted, i, j),
    //         ];
    //       }
    //     }
    //   }
    // }

    // set proper rankings
    const reRankedLeaderboard = leaderboardTeamsSorted.map(
      (leaderboardTeam, index) =>
        new LeaderboardTeam({
          ...leaderboardTeam,
          rank: index + 1,
          previousRank: leaderboardTeam.rank,
        }),
    );
    setLeaderboard(reRankedLeaderboard);
  };

  useEffect(() => {
    calculateResults(selectedTournament?.groups?.[0]!);
  }, []);

  if (!selectedTournament?.groups?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyState />
        <Typography variant="h3">
          Tournament has not yet been initialized.
        </Typography>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer flexDirection="column" gap={8}>
      <CustomTabs
        items={selectedTournament.groups.map((group) => ({
          label: `Group ${group.groupIndex}`,
          value: group.id,
        }))}
        onTabChanged={(newTabGroupId) => {
          setSelectedGroup(newTabGroupId);
          calculateResults(
            selectedTournament.groups.find(
              (group) => group.id === newTabGroupId,
            )!,
          );
        }}
      />
      <LeaderboardList teams={leaderboard} />
    </FlexContainer>
  );
};

export default TournamentResults;
