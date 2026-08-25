import {
  TestUtils,
  team1,
  team2,
  team3,
  team4,
} from '__tests__/utils/testUtils';
import { GameState, GameWinner } from 'types/GameState';
import League from 'types/League';
import Team from 'types/Team';
import { ITeam } from 'types/interfaces/ITeam';
import { DefaultTournamentSettings } from 'types/TournamentSettings';
import { TournamentStatus } from 'types/TournamentStatus';
import {
  hydrateResultsSnapshot,
  serializeResultsSnapshot,
} from 'utils/resultsSnapshotUtils';
import { TBD_TEAM_LABEL } from 'utils/tournamentUtils';

const buildActiveLeague = () => {
  const teams = [team1, team2, team3, team4];
  const games = [
    TestUtils.generateGame({
      index: 1,
      team1,
      team2,
      gameState: GameState.finished,
      gameWinner: GameWinner.team1,
      team1Wins: 2,
      team2Wins: 1,
    }),
    TestUtils.generateGame({
      index: 2,
      team1: team3,
      team2: team4,
      gameState: GameState.playing,
      gameWinner: GameWinner.notYet,
    }),
  ];

  const tournament = TestUtils.generateStage1Tournament({
    numberOfGroups: 1,
    teams: [teams],
    games: [games],
    tournamentSettings: DefaultTournamentSettings,
  });

  tournament.state.status = TournamentStatus.inProgress;
  tournament.state.activeGameId = tournament.currentStageSchedule?.[0]?.id;

  const league = new League({
    _id: 'league1',
    id: 'league1',
    name: 'league1',
    teams,
    isLeagueSelected: true,
  });
  league.activeTournament = tournament;

  return league;
};

/** Electron's IPC does a structured clone, which drops every prototype. */
const sendOverIpc = (snapshot: unknown) => JSON.parse(JSON.stringify(snapshot));

describe('resultsSnapshotUtils', () => {
  it('rebuilds the league, its getters and its shared references', () => {
    const league = buildActiveLeague();

    const hydrated = hydrateResultsSnapshot(
      sendOverIpc(serializeResultsSnapshot(league)),
    );

    const tournament = hydrated?.activeTournament;
    expect(tournament).toBeDefined();
    expect(tournament?.name).toBe(league.activeTournament?.name);

    // Getters only exist if the prototype survived the trip.
    expect(tournament?.currentStage?.stage).toBe(1);
    expect(tournament?.currentStageGroups?.length).toBe(1);
    expect(tournament?.currentStageSchedule?.length).toBe(
      league.activeTournament?.currentStageSchedule?.length,
    );

    const group = tournament?.currentStageGroups?.[0];
    expect(group?.finishedGames.length).toBe(1);

    // A scheduled game must point at the very same group and game instances the
    // stage holds, otherwise scores and highlighting drift apart.
    const scheduledGame = tournament?.currentStageSchedule?.find(
      (candidate) => candidate.game.id === 'G1',
    );
    expect(scheduledGame).toBeDefined();
    expect(scheduledGame?.group).toBe(group);
    expect(group?.games).toContain(scheduledGame?.game);

    expect(scheduledGame?.game.team1.teamName).toBe(team1.teamName);
    expect(scheduledGame?.game.team1Wins).toBe(2);
    expect(scheduledGame?.game.gameState).toBe(GameState.finished);
    expect(tournament?.state.activeGameId).toBe(
      league.activeTournament?.state.activeGameId,
    );
  });

  it('fills unassigned bracket slots with TBD teams', () => {
    const league = buildActiveLeague();
    const tbdGame = TestUtils.generateGame({
      index: 3,
      team1: new Team({} as ITeam),
      team2: new Team({} as ITeam),
      gameState: GameState.created,
      gameWinner: GameWinner.notYet,
    });
    league.activeTournament?.currentStageGroups?.[0].games.push(tbdGame);

    const hydrated = hydrateResultsSnapshot(
      sendOverIpc(serializeResultsSnapshot(league)),
    );
    const hydratedGame = hydrated?.activeTournament?.currentStageGroups?.[0].games.find(
      (game) => game.id === 'G3',
    );

    expect(hydratedGame?.team1.teamName).toBe(TBD_TEAM_LABEL);
    expect(hydratedGame?.team2.teamName).toBe(TBD_TEAM_LABEL);
  });

  it('returns null when there is no active league', () => {
    expect(
      hydrateResultsSnapshot(sendOverIpc(serializeResultsSnapshot(null))),
    ).toBeNull();
    expect(hydrateResultsSnapshot(undefined)).toBeNull();
  });
});
