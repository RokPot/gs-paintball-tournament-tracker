import dayjs, { Dayjs } from 'dayjs';
import { TournamentDto } from './dto/TournamentDto';
import { DefaultGameSettings, GameSettings } from './GameSettings';
import { IRxDB } from './interfaces/IRxDB';
import { ITournament } from './interfaces/ITournament';
import LeaderboardTeam from './LeadeboardTeam';
import Team from './Team';
import TournamentGroup from './TournamentGroup';
import TournamentScheduleGame from './TournamentScheduleGame';
import {
  DefaultTournamentSettings,
  TournamentSettings,
} from './TournamentSettings';
import TournamentStage from './TournamentStage';
import TournamentState from './TournamentState';

export default class Tournament extends IRxDB {
  id: string;

  teams: Team[];

  stages?: TournamentStage[];

  state: TournamentState;

  name: string;

  startDate?: Dayjs;

  endDate?: Dayjs;

  settings: TournamentSettings;

  gameSettings: GameSettings;

  leaderboard?: LeaderboardTeam[];

  constructor(props: ITournament) {
    super(props._id);
    this.id = props.id;
    this.teams = props.teams || [];
    this.state = props.state;
    this.name = props.name;
    this.startDate = dayjs(props.startDate);
    this.endDate = dayjs(props.endDate);
    this.settings = props.settings || DefaultTournamentSettings;
    this.gameSettings = props.gameSettings || DefaultGameSettings;
    this.leaderboard = props.leaderboard;
    this.stages = props.stages;
  }

  public toDto = (): TournamentDto => {
    return {
      _id: this._id,
      id: this.id,
      gameSettings: this.gameSettings,
      name: this.name,
      settings: this.settings,
      state: this.state,
      teamIds: this.teams.map((team) => team._id),
      endDate: this.endDate?.toISOString(),
      startDate: this.startDate?.toISOString(),
      leaderboardTeamIds: this.leaderboard?.map((team) => team._id) || [],
      stageIds: this.stages?.map((stage) => stage._id) || [],
      // Embedded stages array (RxDB) - stages are now part of tournament document
      stages: this.stages?.map((stage) => stage.toDto()) || [],
    };
  };

  public get currentStage(): TournamentStage | undefined {
    return this.stages?.find(
      (tournamentStage) => tournamentStage.stage === this.state.stage,
    );
  }

  public get previousStage(): TournamentStage | undefined {
    return this.stages?.find(
      (tournamentStage) =>
        tournamentStage.stage === (this.state.stage - 1 || 1),
    );
  }

  public get currentStageSchedule(): TournamentScheduleGame[] | undefined {
    if (!this.currentStage) {
      return undefined;
    }
    return this.currentStage?.schedule;
  }

  public get currentStageGroups(): TournamentGroup[] | undefined {
    if (!this.currentStage) {
      return undefined;
    }
    return this.currentStage?.groups;
  }
}
