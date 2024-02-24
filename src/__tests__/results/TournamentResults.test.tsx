import '@testing-library/jest-dom';
import {
  TestUtils,
  team1,
  team2,
  team3,
  team4,
  team5,
} from '__tests__/utils/testUtils';
import { GameState, GameWinner } from 'types/GameState';
import { DefaultTournamentSettings } from 'types/TournamentSettings';
import { TournamentType } from 'types/TournamentType';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';

describe('TournamentResults', () => {
  it('should calculate results', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame(
        1,
        team1,
        team2,
        GameState.finished,
        GameWinner.team1,
      ),
      TestUtils.generateGame(
        1,
        team3,
        team4,
        GameState.finished,
        GameWinner.team1,
      ),
      TestUtils.generateGame(
        1,
        team1,
        team3,
        GameState.finished,
        GameWinner.team1,
      ),
    ];

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
    expect(leaderboard[0].team.id).toBe(team1.id);
    expect(leaderboard[1].team.id).toBe(team3.id);
    expect(leaderboard[2].team.id).toBe(team2.id);
    expect(leaderboard[3].team.id).toBe(team4.id);
  });

  it('should calculate results and check for HeadToHead tiebreaker', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame(
        1,
        team1,
        team2,
        GameState.finished,
        GameWinner.team1,
      ),
      TestUtils.generateGame(
        1,
        team3,
        team4,
        GameState.finished,
        GameWinner.team1,
        200,
      ),
      TestUtils.generateGame(
        1,
        team1,
        team3,
        GameState.finished,
        GameWinner.team1,
      ),
      TestUtils.generateGame(
        1,
        team3,
        team2,
        GameState.finished,
        GameWinner.team1,
      ),
    ];

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
    expect(leaderboard[0].team.id).toBe(team1.id);
    expect(leaderboard[1].team.id).toBe(team3.id);
    expect(leaderboard[2].team.id).toBe(team4.id);
    expect(leaderboard[3].team.id).toBe(team2.id);
  });

  it('should calculate results and check for GreatestTimeRemainingAmongAllWonGames', () => {
    const gamesWithClearWinner = [
      TestUtils.generateGame(
        1,
        team1,
        team2,
        GameState.finished,
        GameWinner.team1,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team3,
        GameState.finished,
        GameWinner.team1,
      ),
      TestUtils.generateGame(
        3,
        team1,
        team4,
        GameState.finished,
        GameWinner.draw,
      ),
      TestUtils.generateGame(
        4,
        team2,
        team3,
        GameState.finished,
        GameWinner.team2,
      ),
      TestUtils.generateGame(
        5,
        team2,
        team4,
        GameState.finished,
        GameWinner.team2,
        450,
      ),
      TestUtils.generateGame(
        5,
        team3,
        team4,
        GameState.finished,
        GameWinner.team2,
      ),
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
      TestUtils.generateGame(
        1,
        team1,
        team2,
        GameState.finished,
        GameWinner.team1,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team3,
        GameState.finished,
        GameWinner.team1,
      ),
      TestUtils.generateGame(
        3,
        team1,
        team4,
        GameState.finished,
        GameWinner.draw,
      ),
      TestUtils.generateGame(
        4,
        team2,
        team3,
        GameState.finished,
        GameWinner.team2,
      ),
      TestUtils.generateGame(
        5,
        team2,
        team4,
        GameState.finished,
        GameWinner.team2,
        450,
      ),
      TestUtils.generateGame(
        5,
        team3,
        team4,
        GameState.finished,
        GameWinner.team2,
      ),
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
      TestUtils.generateGame(
        1,
        team1,
        team2,
        GameState.finished,
        GameWinner.team1,
        350,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team3,
        GameState.finished,
        GameWinner.team1,
        300,
      ),
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
      TestUtils.generateGame(
        1,
        team1,
        team2,
        GameState.finished,
        GameWinner.team1,
        300,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team3,
        GameState.finished,
        GameWinner.team1,
        250,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team4,
        GameState.finished,
        GameWinner.team1,
        400,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team5,
        GameState.finished,
        GameWinner.team1,
        350,
      ),
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
      TestUtils.generateGame(
        1,
        team1,
        team2,
        GameState.finished,
        GameWinner.team1,
        250,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team3,
        GameState.finished,
        GameWinner.team1,
        300,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team4,
        GameState.finished,
        GameWinner.team1,
        350,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team5,
        GameState.finished,
        GameWinner.team1,
        400,
      ),
      // give everyone 1 win
      TestUtils.generateGame(
        1,
        team1,
        team2,
        GameState.finished,
        GameWinner.team2,
        250,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team3,
        GameState.finished,
        GameWinner.team2,
        300,
      ),
      TestUtils.generateGame(
        2,
        team5,
        team4,
        GameState.finished,
        GameWinner.team2,
        350,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team5,
        GameState.finished,
        GameWinner.team2,
        400,
      ),
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
      TestUtils.generateGame(
        1,
        team2,
        team1,
        GameState.finished,
        GameWinner.team1,
        250,
      ),
      TestUtils.generateGame(
        2,
        team2,
        team3,
        GameState.finished,
        GameWinner.team1,
        300,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team4,
        GameState.finished,
        GameWinner.team1,
        340,
      ),
      TestUtils.generateGame(
        2,
        team1,
        team3,
        GameState.finished,
        GameWinner.team1,
        400,
      ),
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
});
