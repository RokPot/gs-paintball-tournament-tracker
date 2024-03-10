import '@testing-library/jest-dom';
import {
  TestUtils,
  team1,
  team2,
  team3,
  team4,
  team5,
  team6,
} from '__tests__/utils/testUtils';
import { GameState, GameWinner } from 'types/GameState';
import MatchState from 'types/MatchState';
import { DefaultTournamentSettings } from 'types/TournamentSettings';
import { TournamentType } from 'types/TournamentType';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';

describe('TournamentResults', () => {
  it('should calculate results', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team3,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
    ];

    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    // T1 - 2 Wins
    // T2 - 0 Wins
    // T3 - 1 Wins
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(4);
    expect(leaderboard[0].team.id).toBe(team1.id);
    expect(leaderboard[1].team.id).toBe(team3.id);
    expect(leaderboard[2].team.id).toBe(team2.id);
    expect(leaderboard[3].team.id).toBe(team4.id);
  });

  it('should calculate results and check for HeadToHead tiebreaker', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team3,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 200,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team3,
        team2: team1,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
    ];
    // T1 2 wins
    // T3 2 wins

    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );

    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(4);
    expect(leaderboard[0].team.id).toBe(team3.id);
    expect(leaderboard[1].team.id).toBe(team1.id);
    expect(leaderboard[2].team.id).toBe(team4.id);
    expect(leaderboard[3].team.id).toBe(team2.id);
  });

  it('should calculate results and check for GreatestTimeRemainingAmongAllWonGames', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.draw,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
        gameTime: 450,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team3,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
      }),
    ];
    // Team 1 - 2 Wins
    // Team 2 - 1 Win
    // Team 3 - 1 Win
    // Team 4 - 2 Wins
    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(4);
    expect(leaderboard[0].team.id).toBe(team4.id);
    expect(leaderboard[1].team.id).toBe(team1.id);
    expect(leaderboard[2].team.id).toBe(team3.id);
    expect(leaderboard[3].team.id).toBe(team2.id);
  });

  it('should calculate results and check for LeastTimeRemainingAmongAllLostGames', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.draw,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
        gameTime: 450,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team3,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
      }),
    ];
    // Team 1 - 2 Wins
    // Team 2 - 1 Win
    // Team 3 - 1 Win
    // Team 4 - 2 Wins
    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(4);
    expect(leaderboard[0].team.id).toBe(team4.id);
    expect(leaderboard[1].team.id).toBe(team1.id);
    expect(leaderboard[2].team.id).toBe(team3.id);
    expect(leaderboard[3].team.id).toBe(team2.id);
  });

  it('should calculate results and check for LeastTimeRemainingAmongTiedLostGames', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 350,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 300,
      }),
    ];
    // Team 1 - 2 Wins
    // Team 2 - 0 Win
    // Team 3 - 0 Win
    // T1, T3, T2
    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3],
      TournamentType.roundRobin,
    );
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(3);
    expect(leaderboard[0].team.id).toBe(team1.id);
    expect(leaderboard[1].team.id).toBe(team3.id);
    expect(leaderboard[2].team.id).toBe(team2.id);
  });

  it('should calculate results and check for LeastTimeRemainingAmongTiedLostGames for 4 teams', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 300,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 250,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 400,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team5,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 350,
      }),
    ];
    // Team 1 - 2 Wins
    // Team 2 - 0 Win
    // Team 3 - 0 Win
    // Team 4 - 0 Win
    // Team 5 - 0 Win
    // T1, T3, T2
    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4, team5],
      TournamentType.roundRobin,
    );
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(5);
    expect(leaderboard[0].team.id).toBe(team1.id);
    expect(leaderboard[1].team.id).toBe(team3.id);
    expect(leaderboard[2].team.id).toBe(team2.id);
    expect(leaderboard[3].team.id).toBe(team5.id);
    expect(leaderboard[4].team.id).toBe(team4.id);
  });

  it('should calculate results with 4 tied teams', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 250,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 300,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 350,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team5,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 400,
      }),
      // give everyone 1 win
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
        gameTime: 250,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
        gameTime: 300,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team5,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
        gameTime: 350,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team5,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
        gameTime: 400,
      }),
    ];
    // Team 1 - 4 Wins
    // Team 2 - 1 Win
    // Team 3 - 1 Win
    // Team 4 - 1 Win - 4 vs 5 - WIN 4
    // Team 5 - 1 Win
    // T1, T5, T4, T3, T2
    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4, team5],
      TournamentType.roundRobin,
    );
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(5);
    expect(leaderboard[0].team.id).toBe(team1.id);
    expect(leaderboard[1].team.id).toBe(team5.id);
    expect(leaderboard[2].team.id).toBe(team4.id);
    expect(leaderboard[3].team.id).toBe(team3.id);
    expect(leaderboard[4].team.id).toBe(team2.id);
  });

  it('should calculate results with 2 paired tied teams 1 HeadToHead, 1 Least Time', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team1,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 250,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 300,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 340,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 400,
      }),
    ];
    // T1 - T2
    // T1 - T3
    // T2 - T4
    // T2 - T5
    // Team 1 - 2 Wins
    // Team 2 - 2 Win
    // Team 3 - 0 Win
    // Team 5 - 0 Win
    // T2, T1, T4, T3
    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(4);
    expect(leaderboard[0].team.id).toBe(team2.id);
    expect(leaderboard[1].team.id).toBe(team1.id);
    expect(leaderboard[2].team.id).toBe(team4.id);
    expect(leaderboard[3].team.id).toBe(team3.id);
  });

  it('should calculate results and check for NumberOfCleanGames', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 250,
        team1Wins: 2,
        team2Wins: 1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 300,
        team1Wins: 2,
        team2Wins: 0,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team5,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 260,
        team1Wins: 2,
        team2Wins: 0,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team6,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 400,
        team1Wins: 2,
        team2Wins: 0,
      }),
    ];
    // T1 - T2
    // T1 - T3
    // T2 - T4
    // T2 - T5
    // Team 1 - 2 Wins
    // Team 2 - 2 Win
    // Team 3 - 0 Win
    // Team 5 - 0 Win
    // T2, T1, T4, T3
    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4, team5, team6],
      TournamentType.roundRobin,
    );
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(6);
    expect(leaderboard[0].team.id).toBe(team2.id);
    expect(leaderboard[1].team.id).toBe(team1.id);
    expect(leaderboard[2].team.id).toBe(team3.id);
    expect(leaderboard[3].team.id).toBe(team5.id);
    expect(leaderboard[4].team.id).toBe(team4.id);
    expect(leaderboard[5].team.id).toBe(team6.id);
  });

  it('should calculate results and check for NumberOfCleanGames all teams in', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 250,
        team1Wins: 2,
        team2Wins: 1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 300,
        team1Wins: 1,
        team2Wins: 2,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team5,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 260,
        team1Wins: 2,
        team2Wins: 0,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team6,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 400,
        team1Wins: 2,
        team2Wins: 0,
      }),
    ];
    // T1 - T2
    // T1 - T3
    // T2 - T4
    // T2 - T5
    // Team 1 - 2 Wins
    // Team 2 - 2 Win
    // Team 3 - 0 Win
    // Team 5 - 0 Win
    // T2, T1, T4, T3
    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4, team5, team6],
      TournamentType.roundRobin,
    );
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(6);
    expect(leaderboard[0].team.id).toBe(team2.id);
    expect(leaderboard[1].team.id).toBe(team1.id);
    expect(leaderboard[2].team.id).toBe(team3.id);
    expect(leaderboard[3].team.id).toBe(team5.id);
    expect(leaderboard[4].team.id).toBe(team4.id);
    expect(leaderboard[5].team.id).toBe(team6.id);
  });

  it('should calculate results and check for NumberOfMatchesWonInTiedGames', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 250,
        team1Wins: 2,
        team2Wins: 1,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 300,
        team1Wins: 2,
        team2Wins: 0,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team5,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 260,
        team1Wins: 2,
        team2Wins: 0,
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team6,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 400,
        team1Wins: 2,
        team2Wins: 0,
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.draw,
        gameTime: 400,
        team1Wins: 1,
        team2Wins: 2,
        matches: [
          {
            id: '1',
            matchDurationInSeconds: 10,
            matchState: MatchState.team1Win,
            team1Margin: 3,
            team2Margin: -3,
          },
          {
            id: '2',
            matchDurationInSeconds: 10,
            matchState: MatchState.team2Win,
            team1Margin: -3,
            team2Margin: 3,
          },
          {
            id: '3',
            matchDurationInSeconds: 10,
            matchState: MatchState.team2Win,
            team1Margin: -3,
            team2Margin: 3,
          },
        ],
      }),
    ];
    // T1 - T2
    // T1 - T3
    // T2 - T4
    // T2 - T5
    // Team 1 - 2 Wins
    // Team 2 - 2 Win
    // Team 3 - 0 Win
    // Team 5 - 0 Win
    // T2, T1, T4, T3
    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4, team5, team6],
      TournamentType.roundRobin,
    );
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(6);
    expect(leaderboard[0].team.id).toBe(team2.id);
    expect(leaderboard[1].team.id).toBe(team1.id);
    expect(leaderboard[2].team.id).toBe(team3.id);
    expect(leaderboard[3].team.id).toBe(team5.id);
    expect(leaderboard[4].team.id).toBe(team4.id);
    expect(leaderboard[5].team.id).toBe(team6.id);
  });

  it('should calculate results and check for MatchMargin', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 250,
        team1Wins: 2,
        team2Wins: 1,
        matches: [
          {
            id: '1',
            matchDurationInSeconds: 10,
            matchState: MatchState.team1Win,
            team1Margin: 3,
            team2Margin: -3,
          },
          {
            id: '2',
            matchDurationInSeconds: 10,
            matchState: MatchState.team1Win,
            team1Margin: 3,
            team2Margin: -3,
          },
        ],
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2: team4,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 300,
        team1Wins: 2,
        team2Wins: 0,
        matches: [
          {
            id: '1',
            matchDurationInSeconds: 10,
            matchState: MatchState.team1Win,
            team1Margin: 3,
            team2Margin: -3,
          },
          {
            id: '2',
            matchDurationInSeconds: 10,
            matchState: MatchState.team2Win,
            team1Margin: -3,
            team2Margin: 3,
          },
          {
            id: '2',
            matchDurationInSeconds: 10,
            matchState: MatchState.team1Win,
            team1Margin: 3,
            team2Margin: -3,
          },
        ],
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team5,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 260,
        team1Wins: 2,
        team2Wins: 0,
        matches: [
          {
            id: '1',
            matchDurationInSeconds: 10,
            matchState: MatchState.team1Win,
            team1Margin: 3,
            team2Margin: -3,
          },
          {
            id: '2',
            matchDurationInSeconds: 10,
            matchState: MatchState.team2Win,
            team1Margin: -3,
            team2Margin: 3,
          },
          {
            id: '3',
            matchDurationInSeconds: 10,
            matchState: MatchState.team1Win,
            team1Margin: 3,
            team2Margin: -3,
          },
        ],
      }),
      TestUtils.generateGame({
        index: 1,
        team1: team2,
        team2: team6,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        gameTime: 400,
        team1Wins: 2,
        team2Wins: 0,
        matches: [
          {
            id: '1',
            matchDurationInSeconds: 10,
            matchState: MatchState.team1Win,
            team1Margin: 3,
            team2Margin: -3,
          },
          {
            id: '2',
            matchDurationInSeconds: 10,
            matchState: MatchState.team2Win,
            team1Margin: -3,
            team2Margin: 3,
          },
          {
            id: '3',
            matchDurationInSeconds: 10,
            matchState: MatchState.team1Win,
            team1Margin: 3,
            team2Margin: -3,
          },
        ],
      }),
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.draw,
        gameTime: 400,
        team1Wins: 1,
        team2Wins: 2,
        matches: [
          {
            id: '1',
            matchDurationInSeconds: 10,
            matchState: MatchState.team1Win,
            team1Margin: 3,
            team2Margin: -3,
          },
          {
            id: '2',
            matchDurationInSeconds: 10,
            matchState: MatchState.team2Win,
            team1Margin: -3,
            team2Margin: 3,
          },
        ],
      }),
    ];
    // T1 - T2
    // T1 - T3
    // T2 - T4
    // T2 - T5
    // Team 1 - 2 Wins, Matches: 3, 3, 3, -3, +3
    // Team 2 - 2 Win, Matches: 3, -3, 3, 3, -3, 3
    // Team 3 - 0 Win
    // Team 5 - 0 Win
    // T2, T1, T4, T3
    const newGroup = TestUtils.generateTournamentGroup(
      1,
      gamesWithClearWinner,
      [team1, team2, team3, team4, team5, team6],
      TournamentType.roundRobin,
    );
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(6);
    expect(leaderboard[0].team.id).toBe(team1.id);
    expect(leaderboard[1].team.id).toBe(team2.id);
    expect(leaderboard[2].team.id).toBe(team3.id);
    expect(leaderboard[3].team.id).toBe(team5.id);
    expect(leaderboard[4].team.id).toBe(team4.id);
    expect(leaderboard[5].team.id).toBe(team6.id);
  });
});
