import {
  TestUtils,
  team1,
  team2,
  team3,
  team4,
} from '__tests__/utils/testUtils';
import { GameState, GameWinner } from 'types/GameState';
import TournamentGroup from 'types/TournamentGroup';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { TournamentTypeEnum } from 'types/TournamentType';
import {
  UNPAIRED_SCHEDULE_GAME_ID,
  getPlayableScheduledGames,
  reorderPlayableScheduledGames,
} from 'utils/scheduleReorderUtils';
import { TournamentFlow } from 'utils/tournamentFlowUtils';

const roundRobinType = {
  type: TournamentTypeEnum.roundRobin,
  settings: {
    numberOfWinsRequired: 2,
    firstPlaceNumberOfWinsRequired: 2,
    thirdPlaceNumberOfWinsRequired: 2,
  },
};

const byeProperties = {
  round: 0,
  roundGameNumber: 1,
  winnerNextRoundGameNumber: 1,
  bye: true,
};

const makeScheduledGame = (
  id: string,
  index: number,
  game: ReturnType<typeof TestUtils.generateGame>,
  group: TournamentGroup,
  pairedGameId = UNPAIRED_SCHEDULE_GAME_ID,
): TournamentScheduleGame => ({
  id,
  index,
  gameNumber: index + 1,
  game,
  group,
  pairedGameId,
});

describe('reorderPlayableScheduledGames', () => {
  it('moves a playable game, keeps BYE slots, and renumbers', () => {
    const group = TestUtils.generateTournamentGroup(
      1,
      [],
      [team1, team2, team3, team4],
      roundRobinType,
    );
    const playable0 = makeScheduledGame(
      's0',
      0,
      TestUtils.generateGame({
        index: 1,
        team1,
        team2,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      group,
    );
    const bye1 = makeScheduledGame(
      'bye1',
      1,
      TestUtils.generateGame({
        index: 2,
        team1,
        team2: team3,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
        bracketProperties: byeProperties,
      }),
      group,
    );
    const playable2 = makeScheduledGame(
      's2',
      2,
      TestUtils.generateGame({
        index: 3,
        team1: team3,
        team2: team4,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      group,
    );
    const bye3 = makeScheduledGame(
      'bye3',
      3,
      TestUtils.generateGame({
        index: 4,
        team1,
        team2: team4,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
        bracketProperties: byeProperties,
      }),
      group,
    );
    const playable4 = makeScheduledGame(
      's4',
      4,
      TestUtils.generateGame({
        index: 5,
        team1: team2,
        team2: team4,
        gameState: GameState.created,
        gameWinner: GameWinner.notYet,
      }),
      group,
    );
    const schedule = [playable0, bye1, playable2, bye3, playable4];

    const reordered = reorderPlayableScheduledGames(schedule, 2, 0, false);

    expect(reordered.map((scheduledGame) => scheduledGame.id)).toEqual([
      's4',
      'bye1',
      's0',
      'bye3',
      's2',
    ]);
    expect(reordered[1].game.bracketProperties?.bye).toBe(true);
    expect(reordered[3].game.bracketProperties?.bye).toBe(true);
    expect(reordered.map((scheduledGame) => scheduledGame.gameNumber)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(reordered.map((scheduledGame) => scheduledGame.index)).toEqual([
      0, 1, 2, 3, 4,
    ]);
    expect(
      getPlayableScheduledGames(reordered).map(
        (scheduledGame) => scheduledGame.id,
      ),
    ).toEqual(['s4', 's0', 's2']);
  });

  it('re-pairs consecutive playable games when switchGames is on', () => {
    const group = TestUtils.generateTournamentGroup(
      1,
      [],
      [team1, team2, team3, team4],
      roundRobinType,
    );
    const schedule = [
      makeScheduledGame(
        's0',
        0,
        TestUtils.generateGame({
          index: 1,
          team1,
          team2,
          gameState: GameState.created,
          gameWinner: GameWinner.notYet,
        }),
        group,
      ),
      makeScheduledGame(
        's1',
        1,
        TestUtils.generateGame({
          index: 2,
          team1,
          team2: team3,
          gameState: GameState.created,
          gameWinner: GameWinner.notYet,
        }),
        group,
      ),
      makeScheduledGame(
        's2',
        2,
        TestUtils.generateGame({
          index: 3,
          team1: team2,
          team2: team4,
          gameState: GameState.created,
          gameWinner: GameWinner.notYet,
        }),
        group,
      ),
    ];
    schedule[0].pairedGameId = 's1';
    schedule[1].pairedGameId = 's0';
    schedule[2].pairedGameId = UNPAIRED_SCHEDULE_GAME_ID;

    const reordered = reorderPlayableScheduledGames(schedule, 2, 0, true);

    expect(reordered.map((scheduledGame) => scheduledGame.id)).toEqual([
      's2',
      's0',
      's1',
    ]);
    expect(reordered[0].pairedGameId).toBe('s0');
    expect(reordered[1].pairedGameId).toBe('s2');
    expect(reordered[2].pairedGameId).toBe(UNPAIRED_SCHEDULE_GAME_ID);
  });

  it('pairs the next two playable games across groups when they are stored as a pair', () => {
    const group1 = TestUtils.generateTournamentGroup(
      1,
      [],
      [team1, team2],
      roundRobinType,
    );
    const group2 = TestUtils.generateTournamentGroup(
      2,
      [],
      [team3, team4],
      roundRobinType,
    );
    const schedule = [
      makeScheduledGame(
        'g1',
        0,
        TestUtils.generateGame({
          index: 1,
          team1,
          team2,
          gameState: GameState.created,
          gameWinner: GameWinner.notYet,
        }),
        group1,
        'g2',
      ),
      makeScheduledGame(
        'g2',
        1,
        TestUtils.generateGame({
          index: 2,
          team1: team3,
          team2: team4,
          gameState: GameState.created,
          gameWinner: GameWinner.notYet,
        }),
        group2,
        'g1',
      ),
    ];

    const nextPair = TournamentFlow.getNextScheduledGamePair(schedule, 0);

    expect(nextPair.game1?.id).toBe('g1');
    expect(nextPair.game2?.id).toBe('g2');
  });

  it('after a mixed-group reorder with switchGames, the new neighbors are the next pair', () => {
    const group1 = TestUtils.generateTournamentGroup(
      1,
      [],
      [team1, team2],
      roundRobinType,
    );
    const group2 = TestUtils.generateTournamentGroup(
      2,
      [],
      [team3, team4],
      roundRobinType,
    );
    const schedule = [
      makeScheduledGame(
        'g1a',
        0,
        TestUtils.generateGame({
          index: 1,
          team1,
          team2,
          gameState: GameState.created,
          gameWinner: GameWinner.notYet,
        }),
        group1,
        'g1b',
      ),
      makeScheduledGame(
        'g1b',
        1,
        TestUtils.generateGame({
          index: 2,
          team1,
          team2: team3,
          gameState: GameState.created,
          gameWinner: GameWinner.notYet,
        }),
        group1,
        'g1a',
      ),
      makeScheduledGame(
        'g2a',
        2,
        TestUtils.generateGame({
          index: 3,
          team1: team3,
          team2: team4,
          gameState: GameState.created,
          gameWinner: GameWinner.notYet,
        }),
        group2,
      ),
    ];

    const reordered = reorderPlayableScheduledGames(schedule, 2, 1, true);
    const nextPair = TournamentFlow.getNextScheduledGamePair(reordered, 0);

    expect(reordered.map((scheduledGame) => scheduledGame.id)).toEqual([
      'g1a',
      'g2a',
      'g1b',
    ]);
    expect(nextPair.game1?.id).toBe('g1a');
    expect(nextPair.game2?.id).toBe('g2a');
  });
});
