import '@testing-library/jest-dom';
import {
  TestUtils,
  team1,
  team2,
  team3,
  team4,
  team5,
  team6,
  team7,
  team8,
  team9,
} from '__tests__/utils/testUtils';
import { DefaultGameSettings } from 'types/GameSettings';
import { GameState, GameWinner } from 'types/GameState';
import Tournament from 'types/Tournament';
import { DefaultTournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentType } from 'types/TournamentType';
import {
  generateNextTournamentStage,
  generateTournamentSchedule,
} from 'utils/tournamentUtils';

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
      settings: {
        ...DefaultTournamentSettings,
        numberOfGroups: 2,
        switchGames: true,
        switchGroups: true,
      },
      teams: [team1, team2, team3, team4, team5, team6],
    });
    const nextStage = generateNextTournamentStage(
      stage1FinishedTournament,
      TournamentType.singleElimination,
    );
    expect(nextStage).toBeDefined();
    expect(stage1FinishedTournament.stages).toBeDefined();
    stage1FinishedTournament!.stages!.push(nextStage!);
    expect(stage1FinishedTournament.stages?.length).toBe(2);
    expect(stage1FinishedTournament?.stages?.[0].schedule[0].group.id).toBe(
      newGroup1.id,
    );
    expect(stage1FinishedTournament?.currentStage?.stage).toBe(2);
    expect(stage1FinishedTournament?.currentStage?.groups?.length).toBe(1);
    expect(stage1FinishedTournament?.currentStage?.groups?.length).toBe(1);

    expect(
      stage1FinishedTournament?.currentStageSchedule?.[0].game.team1.id,
    ).toBe(team1.id);
    expect(
      stage1FinishedTournament?.currentStageSchedule?.[0].game.team2.id,
    ).toBe(team6.id);
    expect(
      stage1FinishedTournament?.currentStageSchedule?.[1].game.team1.id,
    ).toBe(team4.id);
    expect(
      stage1FinishedTournament?.currentStageSchedule?.[1].game.team2.id,
    ).toBe(team3.id);
    expect(
      stage1FinishedTournament?.currentStageSchedule?.[2].game.team2.teamName,
    ).toBe('TBD');
    expect(
      stage1FinishedTournament?.currentStageSchedule?.[2].game.team1.teamName,
    ).toBe('TBD');
    expect(
      stage1FinishedTournament?.currentStageSchedule?.[3].game.team2.teamName,
    ).toBe('TBD');
    expect(
      stage1FinishedTournament?.currentStageSchedule?.[3].game.team1.teamName,
    ).toBe('TBD');
  });

  it('should generate stage 2 schedule with 3 groups', () => {
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
    const gamesForGroup3 = [
      TestUtils.generateGame({
        index: 4,
        team1: team7,
        team2: team8,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 5,
        team1: team7,
        team2: team9,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 6,
        team1: team8,
        team2: team9,
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
    const newGroup3 = TestUtils.generateTournamentGroup(
      3,
      gamesForGroup3,
      [team7, team8, team9],
      TournamentType.roundRobin,
    );

    const stage1ScheduledGames = generateTournamentSchedule(
      [newGroup1, newGroup2, newGroup3],
      {
        ...DefaultTournamentSettings,
        numberOfGroups: 3,
        switchGroups: true,
        switchGames: true,
      },
      TournamentType.roundRobin,
    );
    const previousStage = new TournamentStage({
      _id: 'stage1',
      id: 'stage1',
      groups: [newGroup1, newGroup2, newGroup3],
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
      settings: {
        ...DefaultTournamentSettings,
        numberOfGroups: 3,
        switchGames: true,
        switchGroups: true,
      },
      teams: [team1, team2, team3, team4, team5, team6, team7, team8, team9],
    });
    const nextStage = generateNextTournamentStage(
      stage1FinishedTournament,
      TournamentType.singleElimination,
    );
    expect(nextStage).toBeDefined();
    expect(stage1FinishedTournament.stages).toBeDefined();

    stage1FinishedTournament!.stages!.push(nextStage!);

    expect(stage1FinishedTournament.stages?.length).toBe(2);

    expect(stage1FinishedTournament?.currentStage?.stage).toBe(2);
    expect(stage1FinishedTournament?.currentStage?.groups?.length).toBe(1);
    expect(stage1FinishedTournament?.currentStageSchedule?.length).toBe(9);

    // Visualization https://www.printyourbrackets.com/6seeded.html
    // First and Fourth games are BYE games, which means we don't take them into account

    expect([team3.id, team6.id, team9.id]).toContain(
      stage1FinishedTournament?.currentStageSchedule?.[0].game.team1.id,
    );
    expect([team3.id, team6.id, team9.id]).toContain(
      stage1FinishedTournament?.currentStageSchedule?.[0].game.team2.id,
    );

    expect(
      stage1FinishedTournament?.currentStageSchedule?.[1].game.bracketProperties
        ?.bye,
    ).toBe(true);

    expect([team1.id, team4.id, team7.id]).toContain(
      stage1FinishedTournament?.currentStageSchedule?.[2].game.team1.id,
    );
    expect([team3.id, team6.id, team9.id]).toContain(
      stage1FinishedTournament?.currentStageSchedule?.[2].game.team2.id,
    );

    expect(
      stage1FinishedTournament?.currentStageSchedule?.[3].game.bracketProperties
        ?.bye,
    ).toBe(true);

    expect([team1.id, team4.id, team7.id]).toContain(
      stage1FinishedTournament?.currentStageSchedule?.[4].game.team1.id,
    );
    expect('TBD round1').toBe(
      stage1FinishedTournament?.currentStageSchedule?.[4].game.team2.teamName,
    );

    expect([team1.id, team4.id, team7.id]).toContain(
      stage1FinishedTournament?.currentStageSchedule?.[5].game.team1.id,
    );
    expect('TBD round1').toBe(
      stage1FinishedTournament?.currentStageSchedule?.[5].game.team2.teamName,
    );

    expect(['TBD']).toContain(
      stage1FinishedTournament?.currentStageSchedule?.[6].game.team1.teamName,
    );
    expect(['TBD']).toContain(
      stage1FinishedTournament?.currentStageSchedule?.[6].game.team2.teamName,
    );
  });
  it('should generate stage 2 schedule with 2 groups - Round Robin', () => {
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
      settings: {
        ...DefaultTournamentSettings,
        numberOfGroups: 2,
        switchGames: true,
        switchGroups: true,
      },
      teams: [team1, team2, team3, team4, team5, team6],
    });
    const nextStage = generateNextTournamentStage(
      stage1FinishedTournament,
      TournamentType.roundRobin,
    );
    expect(nextStage).toBeDefined();
    expect(stage1FinishedTournament.stages).toBeDefined();
    stage1FinishedTournament!.stages!.push(nextStage!);
    expect(stage1FinishedTournament.stages?.length).toBe(2);

    expect(stage1FinishedTournament?.currentStage?.stage).toBe(2);
    expect(stage1FinishedTournament?.currentStage?.groups?.length).toBe(1);
    expect(stage1FinishedTournament?.currentStageSchedule?.length).toBe(6);

    const teamGames = [0, 0, 0, 0];
    stage1FinishedTournament?.currentStageSchedule?.forEach((scheduledGame) => {
      if (
        scheduledGame.game.team1.id === team1.id ||
        scheduledGame.game.team2.id === team1.id
      ) {
        teamGames[0] += 1;
      }
      if (
        scheduledGame.game.team1.id === team3.id ||
        scheduledGame.game.team2.id === team3.id
      ) {
        teamGames[1] += 1;
      }
      if (
        scheduledGame.game.team1.id === team4.id ||
        scheduledGame.game.team2.id === team4.id
      ) {
        teamGames[2] += 1;
      }
      if (
        scheduledGame.game.team1.id === team6.id ||
        scheduledGame.game.team2.id === team6.id
      ) {
        teamGames[3] += 1;
      }
    });
    expect(teamGames.toString()).toBe([3, 3, 3, 3].toString());
  });

  it('should generate stage 2 schedule with 3 groups - Round robin', () => {
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
    const gamesForGroup3 = [
      TestUtils.generateGame({
        index: 4,
        team1: team7,
        team2: team8,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 5,
        team1: team7,
        team2: team9,
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
      }),
      TestUtils.generateGame({
        index: 6,
        team1: team8,
        team2: team9,
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
    const newGroup3 = TestUtils.generateTournamentGroup(
      3,
      gamesForGroup3,
      [team7, team8, team9],
      TournamentType.roundRobin,
    );

    const stage1ScheduledGames = generateTournamentSchedule(
      [newGroup1, newGroup2, newGroup3],
      {
        ...DefaultTournamentSettings,
        numberOfGroups: 3,
        switchGroups: true,
        switchGames: true,
      },
      TournamentType.roundRobin,
    );
    const previousStage = new TournamentStage({
      _id: 'stage1',
      id: 'stage1',
      groups: [newGroup1, newGroup2, newGroup3],
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
      settings: {
        ...DefaultTournamentSettings,
        numberOfGroups: 3,
        switchGames: true,
        switchGroups: true,
      },
      teams: [team1, team2, team3, team4, team5, team6, team7, team8, team9],
    });
    const nextStage = generateNextTournamentStage(
      stage1FinishedTournament,
      TournamentType.roundRobin,
    );
    expect(nextStage).toBeDefined();
    expect(stage1FinishedTournament.stages).toBeDefined();

    stage1FinishedTournament!.stages!.push(nextStage!);

    expect(stage1FinishedTournament.stages?.length).toBe(2);

    expect(stage1FinishedTournament?.currentStage?.stage).toBe(2);
    expect(stage1FinishedTournament?.currentStage?.groups?.length).toBe(1);
    expect(stage1FinishedTournament?.currentStageSchedule?.length).toBe(15);

    const teamGames = [0, 0, 0, 0, 0, 0];
    stage1FinishedTournament?.currentStageSchedule?.forEach((scheduledGame) => {
      if (
        scheduledGame.game.team1.id === team1.id ||
        scheduledGame.game.team2.id === team1.id
      ) {
        teamGames[0] += 1;
      }
      if (
        scheduledGame.game.team1.id === team3.id ||
        scheduledGame.game.team2.id === team3.id
      ) {
        teamGames[1] += 1;
      }
      if (
        scheduledGame.game.team1.id === team4.id ||
        scheduledGame.game.team2.id === team4.id
      ) {
        teamGames[2] += 1;
      }
      if (
        scheduledGame.game.team1.id === team6.id ||
        scheduledGame.game.team2.id === team6.id
      ) {
        teamGames[3] += 1;
      }
      if (
        scheduledGame.game.team1.id === team7.id ||
        scheduledGame.game.team2.id === team7.id
      ) {
        teamGames[4] += 1;
      }
      if (
        scheduledGame.game.team1.id === team9.id ||
        scheduledGame.game.team2.id === team9.id
      ) {
        teamGames[5] += 1;
      }
    });
    expect(teamGames.toString()).toBe([5, 5, 5, 5, 5, 5].toString());
  });
});
