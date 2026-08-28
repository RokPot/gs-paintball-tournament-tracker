import dayjs from 'dayjs';
import { BracketProperties } from 'types/BracketProperties';
import Game from 'types/Game';
import { GameSettings } from 'types/GameSettings';
import { GameState, GameWinner } from 'types/GameState';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import { Match } from 'types/Match';
import Team from 'types/Team';
import { TeamMember } from 'types/TeamMember';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentGroupSettings } from 'types/TournamentGroupSettings';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import TournamentState from 'types/TournamentState';
import { TournamentType } from 'types/TournamentType';
import { TBD_TEAM_LABEL } from './tournamentUtils';

/**
 * Electron's structured clone drops prototypes, so `Tournament.currentStage`
 * and friends (getters) would vanish if we shipped the live objects. The
 * results window instead receives this normalized, JSON-plain shape and
 * rebuilds real class instances from it. Normalizing also keeps the payload
 * small: a naive deep clone repeats every group once per scheduled game.
 */
export const RESULTS_SNAPSHOT_VERSION = 1;

type EntityKey = string;

interface TeamSnapshot {
  _id: EntityKey;
  _rev?: string;
  id: string;
  teamName: string;
  teamTag: string;
  wins: number;
  loses: number;
  draw: number;
  members: TeamMember[];
  color?: string;
  createdAt?: string;
  dateCreated?: string;
}

interface GameSnapshot {
  _id: EntityKey;
  _rev?: string;
  id: string;
  team1Key: EntityKey | null;
  team2Key: EntityKey | null;
  matches: Match[];
  gameState: GameState;
  gameWinner: GameWinner;
  team1Wins: number;
  team2Wins: number;
  bracketProperties: BracketProperties | null;
  gameTime: number;
}

interface GroupSnapshot {
  _id: EntityKey;
  _rev?: string;
  id: string;
  groupIndex: number;
  groupType: TournamentType;
  stage: number;
  settings?: TournamentGroupSettings;
  teamKeys: EntityKey[];
  gameKeys: EntityKey[];
}

interface ScheduleGameSnapshot {
  id: string;
  gameNumber: number;
  index: number;
  pairedGameId: string;
  gameKey: EntityKey | null;
  groupKey: EntityKey | null;
}

interface StageSnapshot {
  _id: EntityKey;
  _rev?: string;
  id: string;
  stage: number;
  stageGamesType: TournamentType;
  groupKeys: EntityKey[];
  schedule: ScheduleGameSnapshot[];
}

interface LeaderboardTeamSnapshot {
  _id: EntityKey;
  _rev?: string;
  id: string;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  totalPoints: number;
  rank: number;
  previousRank?: number;
  teamKey: EntityKey | null;
}

interface TournamentSnapshot {
  _id: EntityKey;
  _rev?: string;
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  settings: TournamentSettings;
  gameSettings: GameSettings;
  state: TournamentState;
  teamKeys: EntityKey[];
  leaderboardKeys: EntityKey[];
  stages: StageSnapshot[];
}

interface LeagueSnapshot {
  _id: EntityKey;
  _rev?: string;
  id: string;
  name: string;
  createdAt?: string;
  isLeagueSelected?: boolean;
  teamKeys: EntityKey[];
  leaderboardKeys: EntityKey[];
}

export interface ResultsSnapshot {
  version: number;
  league: LeagueSnapshot | null;
  tournament: TournamentSnapshot | null;
  teams: TeamSnapshot[];
  games: GameSnapshot[];
  groups: GroupSnapshot[];
  leaderboardTeams: LeaderboardTeamSnapshot[];
}

export const EMPTY_RESULTS_SNAPSHOT: ResultsSnapshot = {
  version: RESULTS_SNAPSHOT_VERSION,
  league: null,
  tournament: null,
  teams: [],
  games: [],
  groups: [],
  leaderboardTeams: [],
};

/**
 * Schedule entries in the database point at `id` while most relations use
 * `_id`, so pick whichever the entity actually carries. Both sides of a
 * reference are keyed through here, which keeps them consistent either way.
 */
const keyOf = (
  entity?: { _id?: string; id?: string } | null,
): string | null => {
  if (!entity) {
    return null;
  }
  return entity._id || entity.id || null;
};

const createPlaceholderTeam = () =>
  new Team({
    _id: '',
    id: '',
    teamName: TBD_TEAM_LABEL,
    teamTag: TBD_TEAM_LABEL,
  });

export const serializeResultsSnapshot = (
  league?: League | null,
): ResultsSnapshot => {
  if (!league) {
    return EMPTY_RESULTS_SNAPSHOT;
  }

  const teams = new Map<EntityKey, TeamSnapshot>();
  const games = new Map<EntityKey, GameSnapshot>();
  const groups = new Map<EntityKey, GroupSnapshot>();
  const leaderboardTeams = new Map<EntityKey, LeaderboardTeamSnapshot>();

  const addTeam = (team?: Team | null): EntityKey | null => {
    const key = keyOf(team);
    if (!key || !team) {
      return null;
    }
    if (!teams.has(key)) {
      teams.set(key, {
        _id: team._id,
        id: team.id,
        teamName: team.teamName,
        teamTag: team.teamTag,
        wins: team.wins,
        loses: team.loses,
        draw: team.draw,
        members: team.members || [],
        color: team.color,
        createdAt: team.createdAt
          ? dayjs(team.createdAt).toISOString()
          : undefined,
      });
    }
    return key;
  };

  const addGame = (game?: Game | null): EntityKey | null => {
    const key = keyOf(game);
    if (!key || !game) {
      return null;
    }
    if (!games.has(key)) {
      games.set(key, {
        _id: game._id,
        id: game.id,
        team1Key: addTeam(game.team1),
        team2Key: addTeam(game.team2),
        matches: game.matches || [],
        gameState: game.gameState,
        gameWinner: game.gameWinner,
        team1Wins: game.team1Wins,
        team2Wins: game.team2Wins,
        bracketProperties: game.bracketProperties,
        gameTime: game.gameTime,
      });
    }
    return key;
  };

  const addGroup = (group?: TournamentGroup | null): EntityKey | null => {
    const key = keyOf(group);
    if (!key || !group) {
      return null;
    }
    if (!groups.has(key)) {
      groups.set(key, {
        _id: group._id,
        id: group.id,
        groupIndex: group.groupIndex,
        groupType: group.groupType,
        stage: group.stage,
        settings: group.settings,
        teamKeys: (group.teams || [])
          .map(addTeam)
          .filter((teamKey): teamKey is EntityKey => !!teamKey),
        gameKeys: (group.games || [])
          .map(addGame)
          .filter((gameKey): gameKey is EntityKey => !!gameKey),
      });
    }
    return key;
  };

  const addLeaderboardTeam = (
    leaderboardTeam?: LeaderboardTeam | null,
  ): EntityKey | null => {
    const key = keyOf(leaderboardTeam);
    if (!key || !leaderboardTeam) {
      return null;
    }
    if (!leaderboardTeams.has(key)) {
      leaderboardTeams.set(key, {
        _id: leaderboardTeam._id,
        id: leaderboardTeam.id,
        totalWins: leaderboardTeam.totalWins,
        totalLosses: leaderboardTeam.totalLosses,
        totalDraws: leaderboardTeam.totalDraws,
        totalPoints: leaderboardTeam.totalPoints,
        rank: leaderboardTeam.rank,
        previousRank: leaderboardTeam.previousRank,
        teamKey: addTeam(leaderboardTeam.team),
      });
    }
    return key;
  };

  const { activeTournament } = league;

  const tournament: TournamentSnapshot | null = activeTournament
    ? {
        _id: activeTournament._id,
        id: activeTournament.id,
        name: activeTournament.name,
        startDate: activeTournament.startDate?.toISOString(),
        endDate: activeTournament.endDate?.toISOString(),
        settings: activeTournament.settings,
        gameSettings: activeTournament.gameSettings,
        state: activeTournament.state,
        teamKeys: (activeTournament.teams || [])
          .map(addTeam)
          .filter((teamKey): teamKey is EntityKey => !!teamKey),
        leaderboardKeys: (activeTournament.leaderboard || [])
          .map(addLeaderboardTeam)
          .filter((boardKey): boardKey is EntityKey => !!boardKey),
        stages: (activeTournament.stages || []).map((stage) => ({
          _id: stage._id,
          id: stage.id,
          stage: stage.stage,
          stageGamesType: stage.stageGamesType,
          groupKeys: (stage.groups || [])
            .map(addGroup)
            .filter((groupKey): groupKey is EntityKey => !!groupKey),
          schedule: (stage.schedule || []).map((scheduledGame) => ({
            id: scheduledGame.id,
            gameNumber: scheduledGame.gameNumber,
            index: scheduledGame.index,
            pairedGameId: scheduledGame.pairedGameId,
            gameKey: addGame(scheduledGame.game),
            groupKey: addGroup(scheduledGame.group),
          })),
        })),
      }
    : null;

  return {
    version: RESULTS_SNAPSHOT_VERSION,
    league: {
      _id: league._id,
      id: league.id,
      name: league.name,
      createdAt: league.createdAt?.toISOString(),
      teamKeys: (league.teams || [])
        .map(addTeam)
        .filter((teamKey): teamKey is EntityKey => !!teamKey),
      leaderboardKeys: (league.leaderboard || [])
        .map(addLeaderboardTeam)
        .filter((boardKey): boardKey is EntityKey => !!boardKey),
    },
    tournament,
    teams: [...teams.values()],
    games: [...games.values()],
    groups: [...groups.values()],
    leaderboardTeams: [...leaderboardTeams.values()],
  };
};

const isResultsSnapshot = (value: unknown): value is ResultsSnapshot => {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as ResultsSnapshot).version === 'number'
  );
};

export const hydrateResultsSnapshot = (snapshot: unknown): League | null => {
  if (!isResultsSnapshot(snapshot) || !snapshot.league) {
    return null;
  }

  const teams = new Map<EntityKey, Team>(
    snapshot.teams.map((team) => [
      team._id || team.id,
      new Team({
        ...team,
        createdAt:
          team.createdAt || team.dateCreated
            ? dayjs(team.createdAt || team.dateCreated)
            : undefined,
      }),
    ]),
  );

  const resolveTeam = (key: EntityKey | null) =>
    key ? teams.get(key) : undefined;

  const games = new Map<EntityKey, Game>(
    snapshot.games.map((game) => [
      game._id || game.id,
      new Game({
        ...game,
        team1: resolveTeam(game.team1Key) ?? createPlaceholderTeam(),
        team2: resolveTeam(game.team2Key) ?? createPlaceholderTeam(),
      }),
    ]),
  );

  const groups = new Map<EntityKey, TournamentGroup>(
    snapshot.groups.map((group) => [
      group._id || group.id,
      new TournamentGroup({
        ...group,
        teams: group.teamKeys
          .map((key) => teams.get(key))
          .filter((team): team is Team => !!team),
        games: group.gameKeys
          .map((key) => games.get(key))
          .filter((game): game is Game => !!game),
      }),
    ]),
  );

  const leaderboardTeams = new Map<EntityKey, LeaderboardTeam>(
    snapshot.leaderboardTeams.map((leaderboardTeam) => [
      leaderboardTeam._id || leaderboardTeam.id,
      new LeaderboardTeam({
        ...leaderboardTeam,
        team: resolveTeam(leaderboardTeam.teamKey) as Team,
      }),
    ]),
  );

  const league = new League({
    ...snapshot.league,
    teams: snapshot.league.teamKeys
      .map((key) => teams.get(key))
      .filter((team): team is Team => !!team),
    leaderboard: snapshot.league.leaderboardKeys
      .map((key) => leaderboardTeams.get(key))
      .filter((team): team is LeaderboardTeam => !!team),
    tournaments: [],
  });

  if (!snapshot.tournament) {
    return league;
  }

  const tournamentSnapshot = snapshot.tournament;
  const stages = tournamentSnapshot.stages.map(
    (stage) =>
      new TournamentStage({
        ...stage,
        groups: stage.groupKeys
          .map((key) => groups.get(key))
          .filter((group): group is TournamentGroup => !!group),
        schedule: stage.schedule
          .map((scheduledGame) => {
            const game = scheduledGame.gameKey
              ? games.get(scheduledGame.gameKey)
              : undefined;
            const group = scheduledGame.groupKey
              ? groups.get(scheduledGame.groupKey)
              : undefined;
            if (!game || !group) {
              return null;
            }
            return {
              id: scheduledGame.id,
              gameNumber: scheduledGame.gameNumber,
              index: scheduledGame.index,
              pairedGameId: scheduledGame.pairedGameId,
              game,
              group,
            };
          })
          .filter(
            (scheduledGame): scheduledGame is TournamentScheduleGame =>
              !!scheduledGame,
          ),
      }),
  );

  const tournament = new Tournament({
    ...tournamentSnapshot,
    state: new TournamentState(tournamentSnapshot.state),
    teams: tournamentSnapshot.teamKeys
      .map((key) => teams.get(key))
      .filter((team): team is Team => !!team),
    leaderboard: tournamentSnapshot.leaderboardKeys
      .map((key) => leaderboardTeams.get(key))
      .filter((team): team is LeaderboardTeam => !!team),
    stages,
  });

  league.activeTournament = tournament;
  league.tournaments = [tournament];

  return league;
};
