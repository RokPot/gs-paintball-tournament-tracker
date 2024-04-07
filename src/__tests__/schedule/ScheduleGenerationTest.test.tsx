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
import { DefaultGameSettings } from 'types/GameSettings';
import { GameState, GameWinner } from 'types/GameState';
import Tournament from 'types/Tournament';
import { DefaultTournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentType } from 'types/TournamentType';
import { generateTournamentSchedule } from 'utils/tournamentUtils';

describe('ScheduleGeneration', () => {
  it('should generate round robin schedule', () => {
    const games = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 2,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 3,
        team1,
        team2: team4,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 4,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 5,
        team1: team2,
        team2: team4,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 6,
        team1: team3,
        team2: team4,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];

    const newGroup = TestUtils.generateTournamentGroup(
      1,
      games,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );

    const scheduledGames = generateTournamentSchedule(
      [newGroup],
      DefaultTournamentSettings,
      TournamentType.roundRobin,
    );

    expect(scheduledGames.length).toBe(6);
    expect(scheduledGames[0].game.id).toBe(games[0].id);
    expect(scheduledGames[1].game.id).toBe(games[1].id);
    expect(scheduledGames[2].game.id).toBe(games[2].id);
    expect(scheduledGames[3].game.id).toBe(games[3].id);
    expect(scheduledGames[4].game.id).toBe(games[4].id);
    expect(scheduledGames[5].game.id).toBe(games[5].id);
  });

  it('should generate single elimination schedule', () => {
    const games = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 2,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 3,
        team1,
        team2: team4,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 4,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 5,
        team1: team2,
        team2: team4,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 6,
        team1: team3,
        team2: team4,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];

    const newGroup = TestUtils.generateTournamentGroup(
      1,
      games,
      [team1, team2, team3, team4],
      TournamentType.singleElimination,
    );

    const scheduledGames = generateTournamentSchedule(
      [newGroup],
      DefaultTournamentSettings,
      TournamentType.singleElimination,
    );

    expect(scheduledGames.length).toBe(6);
    expect(scheduledGames[0].game.id).toBe(games[0].id);
    expect(scheduledGames[1].game.id).toBe(games[1].id);
    expect(scheduledGames[2].game.id).toBe(games[2].id);
    expect(scheduledGames[3].game.id).toBe(games[3].id);
    expect(scheduledGames[4].game.id).toBe(games[4].id);
    expect(scheduledGames[5].game.id).toBe(games[5].id);
  });

  it('should generate round robin schedule for two groups', () => {
    const gamesForGroup1 = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 2,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 3,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];
    const gamesForGroup2 = [
      TestUtils.generateGame({
        index: 4,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 5,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 6,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];
    const newGroup1 = TestUtils.generateTournamentGroup(
      1,
      gamesForGroup1,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    const newGroup2 = TestUtils.generateTournamentGroup(
      2,
      gamesForGroup2,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    const scheduledGames = generateTournamentSchedule(
      [newGroup1, newGroup2],
      { ...DefaultTournamentSettings, numberOfGroups: 2 },
      TournamentType.roundRobin,
    );

    expect(scheduledGames.length).toBe(6);
    expect(scheduledGames[0].group.id).toBe(newGroup1.id);
    expect(scheduledGames[0].game.id).toBe(gamesForGroup1[0].id);
    expect(scheduledGames[1].game.id).toBe(gamesForGroup1[1].id);
    expect(scheduledGames[2].game.id).toBe(gamesForGroup1[2].id);
    expect(scheduledGames[3].group.id).toBe(newGroup2.id);
    expect(scheduledGames[3].game.id).toBe(gamesForGroup2[0].id);
    expect(scheduledGames[4].game.id).toBe(gamesForGroup2[1].id);
    expect(scheduledGames[5].game.id).toBe(gamesForGroup2[2].id);
  });
  it('should generate round robin schedule for three groups', () => {
    const gamesForGroup1 = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 2,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 3,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];
    const gamesForGroup2 = [
      TestUtils.generateGame({
        index: 4,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 5,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 6,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];
    const gamesForGroup3 = [
      TestUtils.generateGame({
        index: 7,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 8,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 9,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];
    const newGroup1 = TestUtils.generateTournamentGroup(
      1,
      gamesForGroup1,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    const newGroup2 = TestUtils.generateTournamentGroup(
      2,
      gamesForGroup2,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    const newGroup3 = TestUtils.generateTournamentGroup(
      3,
      gamesForGroup3,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    const scheduledGames = generateTournamentSchedule(
      [newGroup1, newGroup2, newGroup3],
      { ...DefaultTournamentSettings, numberOfGroups: 3 },
      TournamentType.roundRobin,
    );

    expect(scheduledGames.length).toBe(9);
    expect(scheduledGames[0].group.id).toBe(newGroup1.id);
    expect(scheduledGames[0].game.id).toBe(gamesForGroup1[0].id);
    expect(scheduledGames[1].game.id).toBe(gamesForGroup1[1].id);
    expect(scheduledGames[2].game.id).toBe(gamesForGroup1[2].id);
    expect(scheduledGames[3].group.id).toBe(newGroup2.id);
    expect(scheduledGames[3].game.id).toBe(gamesForGroup2[0].id);
    expect(scheduledGames[4].game.id).toBe(gamesForGroup2[1].id);
    expect(scheduledGames[5].game.id).toBe(gamesForGroup2[2].id);
    expect(scheduledGames[6].group.id).toBe(newGroup3.id);
    expect(scheduledGames[6].game.id).toBe(gamesForGroup3[0].id);
    expect(scheduledGames[7].game.id).toBe(gamesForGroup3[1].id);
    expect(scheduledGames[8].game.id).toBe(gamesForGroup3[2].id);
  });

  it('should generate round robin schedule for two groups with group switching', () => {
    const gamesForGroup1 = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 2,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 3,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];
    const gamesForGroup2 = [
      TestUtils.generateGame({
        index: 4,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 5,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 6,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];

    const newGroup1 = TestUtils.generateTournamentGroup(
      1,
      gamesForGroup1,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    const newGroup2 = TestUtils.generateTournamentGroup(
      2,
      gamesForGroup2,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );

    const scheduledGames = generateTournamentSchedule(
      [newGroup1, newGroup2],
      { ...DefaultTournamentSettings, numberOfGroups: 2, switchGroups: true },
      TournamentType.roundRobin,
    );

    expect(scheduledGames.length).toBe(6);
    expect(scheduledGames[0].group.id).toBe(newGroup1.id);
    expect(scheduledGames[0].game.id).toBe(gamesForGroup1[0].id);
    expect(scheduledGames[1].group.id).toBe(newGroup2.id);
    expect(scheduledGames[1].game.id).toBe(gamesForGroup2[0].id);

    expect(scheduledGames[2].group.id).toBe(newGroup1.id);
    expect(scheduledGames[2].game.id).toBe(gamesForGroup1[1].id);
    expect(scheduledGames[3].group.id).toBe(newGroup2.id);
    expect(scheduledGames[3].game.id).toBe(gamesForGroup2[1].id);

    expect(scheduledGames[4].group.id).toBe(newGroup1.id);
    expect(scheduledGames[4].game.id).toBe(gamesForGroup1[2].id);
    expect(scheduledGames[5].group.id).toBe(newGroup2.id);
    expect(scheduledGames[5].game.id).toBe(gamesForGroup2[2].id);
  });

  it('should generate round robin schedule for two groups with group switching and switching game', () => {
    const gamesForGroup1 = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 2,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 3,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];
    const gamesForGroup2 = [
      TestUtils.generateGame({
        index: 4,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 5,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 6,
        team1: team2,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];

    const newGroup1 = TestUtils.generateTournamentGroup(
      1,
      gamesForGroup1,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );
    const newGroup2 = TestUtils.generateTournamentGroup(
      2,
      gamesForGroup2,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );

    const scheduledGames = generateTournamentSchedule(
      [newGroup1, newGroup2],
      {
        ...DefaultTournamentSettings,
        numberOfGroups: 2,
        switchGroups: true,
        switchGames: true,
      },
      TournamentType.roundRobin,
    );

    expect(scheduledGames.length).toBe(6);
    expect(scheduledGames[0].group.id).toBe(newGroup1.id);
    expect(scheduledGames[0].game.id).toBe(gamesForGroup1[0].id);
    expect(scheduledGames[1].group.id).toBe(newGroup1.id);
    expect(scheduledGames[1].game.id).toBe(gamesForGroup1[1].id);

    expect(scheduledGames[2].group.id).toBe(newGroup2.id);
    expect(scheduledGames[2].game.id).toBe(gamesForGroup2[0].id);
    expect(scheduledGames[3].group.id).toBe(newGroup2.id);
    expect(scheduledGames[3].game.id).toBe(gamesForGroup2[1].id);

    expect(scheduledGames[4].group.id).toBe(newGroup1.id);
    expect(scheduledGames[4].game.id).toBe(gamesForGroup1[2].id);
    expect(scheduledGames[5].group.id).toBe(newGroup2.id);
    expect(scheduledGames[5].game.id).toBe(gamesForGroup2[2].id);
  });

  it('should generate stage 2 schedule with 2 groups', () => {
    const gamesForGroup1 = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 2,
        team1,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 3,
        team1: team2,
        team2: team3,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
      }),
    ];
    const gamesForGroup2 = [
      TestUtils.generateGame({
        index: 4,
        team1: team4,
        team2: team5,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 5,
        team1: team4,
        team2: team6,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 6,
        team1: team5,
        team2: team6,
        gameState: GameState.finished,
        gameWinner: GameWinner.team2,
      }),
    ];

    const newGroup1 = TestUtils.generateTournamentGroup(
      1,
      gamesForGroup1,
      [team1, team2, team3],
      TournamentType.roundRobin,
    );
    const newGroup2 = TestUtils.generateTournamentGroup(
      2,
      gamesForGroup2,
      [team4, team5, team6],
      TournamentType.roundRobin,
    );

    const stage1ScheduledGames = generateTournamentSchedule(
      [newGroup1, newGroup2],
      {
        ...DefaultTournamentSettings,
        numberOfGroups: 2,
        switchGroups: true,
        switchGames: true,
      },
      TournamentType.roundRobin,
    );
    const previousStage = new TournamentStage({
      _id: 'stage1',
      id: 'stage1',
      groups: [newGroup1, newGroup2],
      schedule: stage1ScheduledGames,
      stage: 1,
    });
    const stage1FinishedTournament = new Tournament({
      id: 'T1',
      _id: 'T1',
      name: 'Tournaament 1',
      state: {
        id: 'state1',
        isGameInProgress: false,
        isTournamentFinished: false,
        stage: 2,
        status: TournamentStatus.stageChange,
      },
      gameSettings: DefaultGameSettings,
      stages: [previousStage],
      settings: DefaultTournamentSettings,
      teams: [team1, team2, team3, team4, team5, team6],
    });

    expect(stage1FinishedTournament.stages?.length).toBe(1);
    expect(stage1FinishedTournament?.stages?.[0].schedule[0].group.id).toBe(
      newGroup1.id,
    );
  });
});
