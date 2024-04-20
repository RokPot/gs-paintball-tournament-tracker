import '@testing-library/jest-dom';
import {
  TestUtils,
  team1,
  team2,
  team3,
  team4,
} from '__tests__/utils/testUtils';
import { DefaultGameSettings } from 'types/GameSettings';
import { GameState, GameWinner } from 'types/GameState';
import Tournament from 'types/Tournament';
import { DefaultTournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentType } from 'types/TournamentType';
import {
  generateTournamentSchedule,
  prepareGamesForTournament,
} from 'utils/tournamentUtils';

describe('TournamentFlow', () => {
  it('should begin fresh tournament', () => {
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

    const newGroup1 = TestUtils.generateTournamentGroup(
      1,
      games,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );

    const stage1ScheduledGames = generateTournamentSchedule(
      [newGroup1],
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
      groups: [newGroup1],
      schedule: stage1ScheduledGames,
      stage: 1,
    });

    const stage1Tournament = new Tournament({
      id: 'Tournament1',
      _id: 'Tournament1',
      name: 'Tournament1',
      state: {
        id: 'state1',
        isGameInProgress: false,
        isTournamentFinished: false,
        stage: 1,
        status: TournamentStatus.inProgress,
      },
      gameSettings: DefaultGameSettings,
      stages: [previousStage],
      settings: DefaultTournamentSettings,

      teams: [team1, team2, team3, team4],
    });
    expect(previousStage).toBeDefined();
    expect(stage1Tournament).toBeDefined();

    expect(stage1Tournament.state.status).toBe(TournamentStatus.inProgress);
    const starterGames = prepareGamesForTournament(
      stage1Tournament,
      stage1Tournament.currentStageSchedule,
    );
    expect(starterGames).toBeDefined();
    expect(starterGames?.newPairedGame1).toBeDefined();
    expect(starterGames?.newPairedGame1.game.id).toBe(games[0].id);
    expect(starterGames?.newPairedGame2).toBeUndefined();
  });

  it('should begin fresh tournament with games switching', () => {
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

    const newGroup1 = TestUtils.generateTournamentGroup(
      1,
      games,
      [team1, team2, team3, team4],
      TournamentType.roundRobin,
    );

    const stage1ScheduledGames = generateTournamentSchedule(
      [newGroup1],
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
      groups: [newGroup1],
      schedule: stage1ScheduledGames,
      stage: 1,
    });

    const stage1Tournament = new Tournament({
      id: 'Tournament1',
      _id: 'Tournament1',
      name: 'Tournament1',
      state: {
        id: 'state1',
        isGameInProgress: false,
        isTournamentFinished: false,
        stage: 1,
        status: TournamentStatus.inProgress,
      },
      gameSettings: DefaultGameSettings,
      stages: [previousStage],
      settings: { ...DefaultTournamentSettings, switchGames: true },

      teams: [team1, team2, team3, team4],
    });
    expect(previousStage).toBeDefined();
    expect(stage1Tournament).toBeDefined();

    expect(stage1Tournament.state.status).toBe(TournamentStatus.inProgress);
    const starterGames = prepareGamesForTournament(
      stage1Tournament,
      stage1Tournament.currentStageSchedule,
    );
    expect(starterGames).toBeDefined();
    expect(starterGames?.newPairedGame1).toBeDefined();
    expect(starterGames?.newPairedGame1.game.id).toBe(games[0].id);
    expect(starterGames?.newPairedGame2?.game.id).toBe(games[1].id);
  });

  it('should finish a single game match', () => {
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
    const stage1Tournament = TestUtils.generateStage1Tournament({
      teams: [[team1, team2, team3, team4]],
      games: [games],
      numberOfGroups: 1,
      tournamentSettings: {
        ...DefaultTournamentSettings,
        numberOfGroups: 2,
        switchGroups: true,
        switchGames: true,
      },
    });
    expect(stage1Tournament).toBeDefined();

    expect(stage1Tournament.state.status).toBe(TournamentStatus.created);
    const starterGames = prepareGamesForTournament(
      stage1Tournament,
      stage1Tournament.currentStageSchedule,
    );
    stage1Tournament.state.status = TournamentStatus.inProgress;
  });
});
