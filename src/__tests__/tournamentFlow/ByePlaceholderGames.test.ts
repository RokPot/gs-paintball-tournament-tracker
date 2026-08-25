import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
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
import useGetScheduleRows from 'hooks/ui/useGetScheduleRows';
import { isByePlaceholderGame } from 'types/BracketProperties';
import { DefaultGameSettings } from 'types/GameSettings';
import { GameState, GameWinner } from 'types/GameState';
import Tournament from 'types/Tournament';
import { DefaultTournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentTypeEnum } from 'types/TournamentType';
import { TournamentFlow } from 'utils/tournamentFlowUtils';
import {
  generateNextTournamentStage,
  generateTournamentSchedule,
} from 'utils/tournamentUtils';

const elimType = {
  type: TournamentTypeEnum.singleElimination,
  settings: {
    numberOfWinsRequired: 2,
    firstPlaceNumberOfWinsRequired: 2,
    thirdPlaceNumberOfWinsRequired: 2,
  },
};

/**
 * 6-team single-elim from 3 finished round-robin groups.
 * Schedule indexes 1 and 3 are BYE placeholders (printyourbrackets 6-seed).
 */
const buildSixTeamElimTournament = (switchGames = true) => {
  const roundRobinType = {
    type: TournamentTypeEnum.roundRobin,
    settings: elimType.settings,
  };
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
    roundRobinType,
  );
  const newGroup2 = TestUtils.generateTournamentGroup(
    2,
    gamesForGroup2,
    [team4, team5, team6],
    roundRobinType,
  );
  const newGroup3 = TestUtils.generateTournamentGroup(
    3,
    gamesForGroup3,
    [team7, team8, team9],
    roundRobinType,
  );

  const settings = {
    ...DefaultTournamentSettings,
    numberOfGroups: 3,
    switchGames,
    switchGroups: true,
  };
  const previousStage = new TournamentStage({
    _id: 'stage1',
    id: 'stage1',
    groups: [newGroup1, newGroup2, newGroup3],
    schedule: generateTournamentSchedule(
      [newGroup1, newGroup2, newGroup3],
      settings,
      roundRobinType,
    ),
    stage: 1,
    stageGamesType: roundRobinType,
  });
  const tournament = new Tournament({
    id: 'T1',
    _id: 'T1',
    name: 'Tournament 1',
    state: {
      id: 'state1',
      isGameInProgress: false,
      isTournamentFinished: false,
      stage: 2,
      status: TournamentStatus.stageChange,
    },
    gameSettings: DefaultGameSettings,
    stages: [previousStage],
    settings,
    teams: [team1, team2, team3, team4, team5, team6, team7, team8, team9],
  });
  const nextStage = generateNextTournamentStage(tournament, elimType);
  tournament.stages!.push(nextStage!);
  return tournament;
};

describe('BYE placeholder games', () => {
  it('identifies single-elim BYE slots and ignores round-robin games', () => {
    const tournament = buildSixTeamElimTournament();
    const schedule = tournament.currentStageSchedule!;

    expect(isByePlaceholderGame(schedule[1].game)).toBe(true);
    expect(isByePlaceholderGame(schedule[3].game)).toBe(true);
    expect(isByePlaceholderGame(schedule[0].game)).toBe(false);
    expect(isByePlaceholderGame(undefined)).toBe(false);
    expect(
      isByePlaceholderGame(
        TestUtils.generateGame({
          index: 1,
          team1,
          team2,
          gameState: GameState.created,
          gameWinner: GameWinner.notYet,
        }),
      ),
    ).toBe(false);
  });

  it('omits BYE placeholders from schedule rows', () => {
    const tournament = buildSixTeamElimTournament();
    const schedule = tournament.currentStageSchedule!;
    const { result } = renderHook(() =>
      useGetScheduleRows(tournament.currentStage, tournament.settings),
    );

    const visibleGameIds = result.current.scheduleRows
      .map((row) => row.scheduledGame?.id)
      .filter((id): id is string => Boolean(id));

    expect(visibleGameIds).not.toContain(schedule[1].id);
    expect(visibleGameIds).not.toContain(schedule[3].id);
    expect(visibleGameIds).toContain(schedule[0].id);
    expect(visibleGameIds).toContain(schedule[2].id);
    expect(
      result.current.scheduleRows.some(
        (row) =>
          row.scheduledGame && isByePlaceholderGame(row.scheduledGame.game),
      ),
    ).toBe(false);
  });

  it('skips BYE games when picking the tournament starter pair', () => {
    const tournament = buildSixTeamElimTournament(true);
    const schedule = tournament.currentStageSchedule!;
    const starterGames = TournamentFlow.prepareGamesForTournament(
      tournament,
      schedule,
    );

    expect(starterGames?.newPairedGame1.id).toBe(schedule[0].id);
    expect(starterGames?.newPairedGame1.game.gameState).toBe(GameState.playing);
    expect(isByePlaceholderGame(starterGames?.newPairedGame1.game)).toBe(false);
    expect(starterGames?.newPairedGame2?.id).toBe(schedule[2].id);
    expect(isByePlaceholderGame(starterGames?.newPairedGame2?.game)).toBe(
      false,
    );
  });

  it('skips BYE games when selecting the next single-elim game', () => {
    const tournament = buildSixTeamElimTournament(false);
    const schedule = tournament.currentStageSchedule!;
    const firstPlayable = schedule[0];
    firstPlayable.game.gameState = GameState.finished;

    const nextGameState = TournamentFlow.switchToNextScheduledGames(
      schedule,
      tournament.settings,
      elimType,
      firstPlayable,
    );

    expect(nextGameState).not.toBe(TournamentFlow.FlowState.NoGamesAvailable);
    if (nextGameState === TournamentFlow.FlowState.NoGamesAvailable) {
      return;
    }

    expect(nextGameState.newActiveGame.id).toBe(schedule[2].id);
    expect(isByePlaceholderGame(nextGameState.newActiveGame.game)).toBe(false);
    expect(nextGameState.newActiveGame.id).not.toBe(schedule[1].id);
    expect(nextGameState.newActiveGame.id).not.toBe(schedule[3].id);
  });

  it('omits BYE placeholders from upcoming scoreboard groups', () => {
    const tournament = buildSixTeamElimTournament();
    const schedule = tournament.currentStageSchedule!;
    const upcomingGroups =
      TournamentFlow.getUpcomingScheduleGameGroups(schedule);
    const upcomingGames = upcomingGroups.flat();

    expect(upcomingGroups.length).toBeGreaterThan(0);
    expect(upcomingGroups[0][0].id).toBe(schedule[0].id);
    expect(upcomingGames.map((game) => game.id)).not.toContain(schedule[1].id);
    expect(upcomingGames.map((game) => game.id)).not.toContain(schedule[3].id);
    expect(
      upcomingGames.some((scheduledGame) =>
        isByePlaceholderGame(scheduledGame.game),
      ),
    ).toBe(false);
  });

  it('does not create leftover games after first and third place', () => {
    const tournament = buildSixTeamElimTournament();
    const schedule = tournament.currentStageSchedule!;
    const group = tournament.currentStageGroups![0];

    expect(schedule).toHaveLength(8);

    const thirdPlace = schedule.find(
      (scheduledGame) => scheduledGame.game.bracketProperties?.isThridPlaceGame,
    );
    const firstPlace = schedule.find(
      (scheduledGame) => scheduledGame.game.bracketProperties?.isFirstPlaceGame,
    );
    expect(thirdPlace).toBeDefined();
    expect(firstPlace).toBeDefined();

    thirdPlace!.game.gameWinner = GameWinner.team1;
    thirdPlace!.game.gameState = GameState.finished;
    firstPlace!.game.gameWinner = GameWinner.team1;
    firstPlace!.game.gameState = GameState.finished;

    expect(
      TournamentFlow.getNextGamesForEliminationsTournament(
        thirdPlace!.game,
        group,
        elimType,
      ),
    ).toEqual({
      nextRoundGameWinner: undefined,
      nextRoundGameLoser: undefined,
    });
    expect(
      TournamentFlow.getNextGamesForEliminationsTournament(
        firstPlace!.game,
        group,
        elimType,
      ),
    ).toEqual({
      nextRoundGameWinner: undefined,
      nextRoundGameLoser: undefined,
    });

    TournamentFlow.prepareNextGameIfEliminationsTournament(
      thirdPlace!.game,
      group,
      elimType,
    );
    TournamentFlow.prepareNextGameIfEliminationsTournament(
      firstPlace!.game,
      group,
      elimType,
    );

    expect(schedule).toHaveLength(8);
    expect(
      schedule.some(
        (scheduledGame) =>
          scheduledGame.game.gameState === GameState.created &&
          !isByePlaceholderGame(scheduledGame.game) &&
          (scheduledGame.game.bracketProperties?.isFirstPlaceGame ||
            scheduledGame.game.bracketProperties?.isThridPlaceGame),
      ),
    ).toBe(false);
    expect(
      schedule.every(
        (scheduledGame) =>
          (scheduledGame.game.bracketProperties?.round ?? 0) < 3,
      ),
    ).toBe(true);
  });
});
