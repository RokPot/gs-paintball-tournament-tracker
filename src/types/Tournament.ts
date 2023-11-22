import dayjs, { Dayjs } from 'dayjs';
import { DocType } from 'services/pouchDB';
import { DefaultGameSettings, GameSettings } from './GameSettings';
import LeaderboardTeam from './LeadeboardTeam';
import Team from './Team';
import { TournamentGroup } from './TournamentGroup';
import {
  DefaultTournamentSettings,
  TournamentSettings,
} from './TournamentSettings';
import { TournamentState } from './TournamentState';
import { TournamentDto } from './dto/TournamentDto';
import { IPouchDB } from './interfaces/IPouchDB';
import { ITournament } from './interfaces/ITournament';

export default class Tournament extends IPouchDB {
  id: string;

  teams: Team[];

  groups: TournamentGroup[];

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
    this.groups = props.groups || [];
    this.state = props.state;
    this.name = props.name;
    this.startDate = dayjs(props.startDate);
    this.endDate = dayjs(props.endDate);
    this.settings = props.settings || DefaultTournamentSettings;
    this.gameSettings = props.gameSettings || DefaultGameSettings;
    this.leaderboard = props.leaderboard;
  }

  public toDto = (): TournamentDto => {
    return {
      _id: this._id,
      _rev: this._rev,
      docType: this.docType,
      id: this.id,
      gameSettings: this.gameSettings,
      groups: this.groups,
      name: this.name,
      settings: this.settings,
      state: this.state,
      teamIds: this.teams.map((team) => team._id),
      endDate: this.endDate?.toISOString(),
      startDate: this.startDate?.toISOString(),
      leaderboardTeamIds: this.leaderboard?.map((team) => team._id) || [],
    };
  };
}
