import dayjs, { Dayjs } from 'dayjs';
import { DefaultGameSettings, GameSettings } from './GameSettings';
import LeaderboardTeam from './LeadeboardTeam';
import Team from './Team';
import {
  DefaultTournamentSettings,
  TournamentSettings,
} from './TournamentSettings';
import { TournamentDto } from './dto/TournamentDto';
import { DocType, IPouchDB } from './interfaces/IPouchDB';
import { ITournament } from './interfaces/ITournament';
import TournamentState from './TournamentState';
import TournamentStage from './TournamentStage';
import TournamentScheduleGame from './TournamentScheduleGame';
import TournamentGroup from './TournamentGroup';

export default class Tournament extends IPouchDB {
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
    super(props._id, props._rev, props.docType || DocType.Tournament);
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
      _rev: this._rev,
      docType: this.docType,
      id: this.id,
      gameSettings: this.gameSettings,
      name: this.name,
      settings: this.settings,
      state: this.state,
      teamIds: this.teams.map((team) => team._id),
      endDate: this.endDate?.toISOString(),
      startDate: this.startDate?.toISOString(),
      leaderboardTeamIds: this.leaderboard?.map((team) => team._id) || [],
      stages: this.stages?.map((stage) => stage._id) || [],
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
