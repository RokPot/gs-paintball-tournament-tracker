import '@testing-library/jest-dom';
import { TournamentFlowTestUtils } from '__tests__/utils/testFlowUtils';

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
} from '__tests__/utils/testUtils';
import { DefaultGameSettings } from 'types/GameSettings';
import { GameState, GameWinner } from 'types/GameState';
import MatchState from 'types/MatchState';
import Tournament from 'types/Tournament';
import { DefaultTournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentType } from 'types/TournamentType';
import { TournamentFlow } from 'utils/tournamentFlowUtils';
import { generateTournamentSchedule } from 'utils/tournamentUtils';

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
    const starterGames = TournamentFlow.prepareGamesForTournament(
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
    const starterGames = TournamentFlow.prepareGamesForTournament(
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

    let currentActiveGame = stage1Tournament.currentStageSchedule?.[0];
    let currentPairedGame1 = stage1Tournament.currentStageSchedule?.[0];
    let currentPairedGame2 = stage1Tournament.currentStageSchedule?.[1];

    expect(currentActiveGame?.id).toBe(currentPairedGame1?.id);

    const finishedMatch1State =
      TournamentFlowTestUtils.FinishScheduledGameMatch(
        TestUtils.generateMatch({
          index: 1,
          matchDurationInSeconds: 0,
          matchState: MatchState.team1Win,
          team1Margin: 2,
          team2Margin: 0,
        }),
        currentActiveGame!,
        { currentDuration: 60, timeLeft: 600 },
        stage1Tournament,
      );
    expect(finishedMatch1State.state).toBe(
      TournamentFlowTestUtils.FinishMatchState.ContinueTournament,
    );

    currentActiveGame = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.activeGameId,
    );
    currentPairedGame1 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame1Id,
    );
    currentPairedGame2 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame2Id,
    );

    expect(currentActiveGame?.id).toBe(currentPairedGame2?.id);
    expect(currentActiveGame?.game?.gameState).toBe(GameState.playing);

    expect(currentPairedGame1?.game.team1Wins).toBe(1);
    expect(currentPairedGame1?.game.team2Wins).toBe(0);
    expect(currentPairedGame1?.game.matches?.length).toBe(1);
    expect(currentPairedGame1?.game.matches?.[0].team1Margin).toBe(2);
    expect(currentPairedGame1?.game.matches?.[0].team2Margin).toBe(0);
  });

  it('should finish a single game match, move to next paired game and finish a match there and move back to the first paired game', () => {
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

    let currentActiveGame = stage1Tournament.currentStageSchedule?.[0];
    let currentPairedGame1 = stage1Tournament.currentStageSchedule?.[0];
    let currentPairedGame2 = stage1Tournament.currentStageSchedule?.[1];

    expect(currentActiveGame?.id).toBe(currentPairedGame1?.id);

    let finishedMatchState = TournamentFlowTestUtils.FinishScheduledGameMatch(
      TestUtils.generateMatch({
        index: 1,
        matchDurationInSeconds: 0,
        matchState: MatchState.team1Win,
        team1Margin: 2,
        team2Margin: 0,
      }),
      currentActiveGame!,
      { currentDuration: 60, timeLeft: 600 },
      stage1Tournament,
    );
    expect(finishedMatchState.state).toBe(
      TournamentFlowTestUtils.FinishMatchState.ContinueTournament,
    );

    currentActiveGame = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.activeGameId,
    );
    currentPairedGame1 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame1Id,
    );
    currentPairedGame2 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame2Id,
    );

    expect(currentActiveGame?.id).toBe(currentPairedGame2?.id);
    expect(currentActiveGame?.game?.gameState).toBe(GameState.playing);

    expect(currentPairedGame1?.game.team1Wins).toBe(1);
    expect(currentPairedGame1?.game.team2Wins).toBe(0);
    expect(currentPairedGame1?.game.matches?.length).toBe(1);
    expect(currentPairedGame1?.game.matches?.[0].team1Margin).toBe(2);
    expect(currentPairedGame1?.game.matches?.[0].team2Margin).toBe(0);

    finishedMatchState = TournamentFlowTestUtils.FinishScheduledGameMatch(
      TestUtils.generateMatch({
        index: 1,
        matchDurationInSeconds: 0,
        matchState: MatchState.team1Win,
        team1Margin: 3,
        team2Margin: -3,
      }),
      currentActiveGame!,
      { currentDuration: 60, timeLeft: 600 },
      stage1Tournament,
    );

    currentActiveGame = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.activeGameId,
    );
    currentPairedGame1 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame1Id,
    );
    currentPairedGame2 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame2Id,
    );

    expect(currentActiveGame?.id).toBe(currentPairedGame2?.id);
    expect(currentActiveGame?.game?.gameState).toBe(GameState.playing);

    expect(currentPairedGame1?.game.team1Wins).toBe(1);
    expect(currentPairedGame1?.game.team2Wins).toBe(0);
    expect(currentPairedGame1?.game.matches?.length).toBe(1);
    expect(currentPairedGame1?.game.matches?.[0].team1Margin).toBe(3);
    expect(currentPairedGame1?.game.matches?.[0].team2Margin).toBe(-3);
  });

  it('should finish game 1 and game 2 matches, and move to next group game pair', () => {
    const games = [
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
        team1Wins: 1,
        team2Wins: 0,
        matches: [
          {
            id: 'match1',
            matchDurationInSeconds: 0,
            matchState: MatchState.team1Win,
            team1Margin: 2,
            team2Margin: 0,
          },
        ],
      }),
      TestUtils.generateGame({
        index: 2,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
        team1Wins: 1,
        team2Wins: 0,
        matches: [
          {
            id: 'match1',
            matchDurationInSeconds: 0,
            matchState: MatchState.team1Win,
            team1Margin: 2,
            team2Margin: 0,
          },
        ],
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

    const games2 = [
      TestUtils.generateGame({
        index: 1,
        team1: team5,
        team2: team6,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
        team1Wins: 1,
        team2Wins: 0,
        matches: [
          {
            id: 'match1',
            matchDurationInSeconds: 0,
            matchState: MatchState.team1Win,
            team1Margin: 2,
            team2Margin: 0,
          },
        ],
      }),
      TestUtils.generateGame({
        index: 2,
        team1: team5,
        team2: team7,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
        team1Wins: 1,
        team2Wins: 0,
        matches: [
          {
            id: 'match1',
            matchDurationInSeconds: 0,
            matchState: MatchState.team1Win,
            team1Margin: 2,
            team2Margin: 0,
          },
        ],
      }),
      TestUtils.generateGame({
        index: 3,
        team1: team5,
        team2: team8,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 4,
        team1: team6,
        team2: team7,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 5,
        team1: team6,
        team2: team8,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      TestUtils.generateGame({
        index: 6,
        team1: team7,
        team2: team8,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
    ];

    const stage1Tournament = TestUtils.generateStage1Tournament({
      teams: [
        [team1, team2, team3, team4],
        [team5, team6, team7, team8],
      ],
      games: [games, games2],
      numberOfGroups: 2,
      tournamentSettings: {
        ...DefaultTournamentSettings,
        numberOfGroups: 2,
        switchGroups: true,
        switchGames: true,
      },
    });
    expect(stage1Tournament).toBeDefined();

    expect(stage1Tournament.state.status).toBe(TournamentStatus.created);

    let currentActiveGame = stage1Tournament.currentStageSchedule?.[0];
    let currentPairedGame1 = stage1Tournament.currentStageSchedule?.[0];
    let currentPairedGame2 = stage1Tournament.currentStageSchedule?.[1];

    expect(currentActiveGame?.id).toBe(currentPairedGame1?.id);

    let finishedMatchState = TournamentFlowTestUtils.FinishScheduledGameMatch(
      TestUtils.generateMatch({
        index: 1,
        matchDurationInSeconds: 0,
        matchState: MatchState.team1Win,
        team1Margin: 2,
        team2Margin: 0,
      }),
      currentActiveGame!,
      { currentDuration: 60, timeLeft: 600 },
      stage1Tournament,
    );
    expect(finishedMatchState.state).toBe(
      TournamentFlowTestUtils.FinishMatchState.ContinueTournament,
    );

    currentActiveGame = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.activeGameId,
    );
    currentPairedGame1 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame1Id,
    );
    currentPairedGame2 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame2Id,
    );

    expect(currentActiveGame?.id).toBe(currentPairedGame2?.id);
    expect(currentPairedGame2?.game?.gameState).toBe(GameState.playing);
    expect(currentPairedGame1?.game?.gameState).toBe(GameState.finished);

    expect(currentPairedGame1?.game.team1Wins).toBe(2);
    expect(currentPairedGame1?.game.team2Wins).toBe(0);

    expect(currentPairedGame1?.game.matches?.length).toBe(2);
    expect(currentPairedGame1?.game.matches?.[1].team1Margin).toBe(2);
    expect(currentPairedGame1?.game.matches?.[1].team2Margin).toBe(0);

    finishedMatchState = TournamentFlowTestUtils.FinishScheduledGameMatch(
      TestUtils.generateMatch({
        index: 1,
        matchDurationInSeconds: 0,
        matchState: MatchState.team1Win,
        team1Margin: 3,
        team2Margin: -3,
      }),
      currentActiveGame!,
      { currentDuration: 60, timeLeft: 600 },
      stage1Tournament,
    );

    currentActiveGame = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.activeGameId,
    );
    currentPairedGame1 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame1Id,
    );
    currentPairedGame2 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame2Id,
    );

    expect(currentActiveGame?.group.groupIndex).toBe(2);
    expect(currentActiveGame?.id).toBe(currentPairedGame1?.id);
    expect(currentActiveGame?.game?.gameState).toBe(GameState.playing);

    expect(currentPairedGame1?.game.team1Wins).toBe(1);
    expect(currentPairedGame1?.game.team2Wins).toBe(0);
    expect(currentPairedGame1?.game.matches?.length).toBe(1);
    expect(currentPairedGame1?.game.matches?.[0].team1Margin).toBe(2);
    expect(currentPairedGame1?.game.matches?.[0].team2Margin).toBe(0);
  });

  it('play 2 matches of Game 1, it should not go to Game 2 because it is finished and switch to game 3 and 4', () => {
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
        gameState: GameState.finished,
        gameWinner: GameWinner.team1,
        team1Wins: 2,
        team2Wins: 0,
        matches: [
          {
            id: 'match1',
            matchDurationInSeconds: 0,
            matchState: MatchState.team1Win,
            team1Margin: 2,
            team2Margin: 0,
          },
          {
            id: 'match2',
            matchDurationInSeconds: 0,
            matchState: MatchState.team1Win,
            team1Margin: 2,
            team2Margin: 0,
          },
        ],
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
        numberOfGroups: 1,
        switchGroups: true,
        switchGames: true,
      },
    });

    let currentActiveGame = stage1Tournament.currentStageSchedule?.[0];
    let currentPairedGame1 = stage1Tournament.currentStageSchedule?.[0];
    let currentPairedGame2 = stage1Tournament.currentStageSchedule?.[1];
    currentPairedGame2!.game.gameState = GameState.finished;

    TournamentFlowTestUtils.FinishScheduledGameMatch(
      TestUtils.generateMatch({
        index: 1,
        matchDurationInSeconds: 0,
        matchState: MatchState.team1Win,
        team1Margin: 2,
        team2Margin: 0,
      }),
      currentActiveGame!,
      { currentDuration: 60, timeLeft: 600 },
      stage1Tournament,
    );

    currentActiveGame = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.activeGameId,
    );

    TournamentFlowTestUtils.FinishScheduledGameMatch(
      TestUtils.generateMatch({
        index: 1,
        matchDurationInSeconds: 0,
        matchState: MatchState.team1Win,
        team1Margin: 3,
        team2Margin: -3,
      }),
      currentActiveGame!,
      { currentDuration: 60, timeLeft: 600 },
      stage1Tournament,
    );

    currentActiveGame = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.activeGameId,
    );
    currentPairedGame1 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame1Id,
    );
    currentPairedGame2 = stage1Tournament.currentStageSchedule?.find(
      (schedGame) => schedGame.id === stage1Tournament.state.pairedGame2Id,
    );

    expect(currentPairedGame1?.game?.id).toBe(games[2].id);
    expect(currentPairedGame2?.game?.id).toBe(games[3].id);
  });
});
