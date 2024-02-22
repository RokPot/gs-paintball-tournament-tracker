import '@testing-library/jest-dom';
import { TestUtils } from '__tests__/utils/testUtils';
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

    expect(gamesWithClearWinner[0].team1.id).toBe(team1.id);
    expect(gamesWithClearWinner[0].team2.id).toBe(team2.id);
    expect(gamesWithClearWinner[1].team1.id).toBe(team3.id);
    expect(gamesWithClearWinner[1].team2.id).toBe(team4.id);
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

    expect(gamesWithClearWinner[0].team1.id).toBe(team1.id);
    expect(gamesWithClearWinner[0].team2.id).toBe(team2.id);
    expect(gamesWithClearWinner[1].team1.id).toBe(team3.id);
    expect(gamesWithClearWinner[1].team2.id).toBe(team4.id);
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

  it('should calculate results and check for GreatestTimeRemainingAmongTiedWonGames', () => {
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
});
