import { DefaultGameSettings, GameSettings } from './GameSettings';
import { Team } from './Team';
import { TournamentGroup } from './TournamentGroup';
import {
  DefaultTournamentSettings,
  TournamentSettings,
} from './TournamentSettings';
import { TournamentState } from './TournamentState';
import { ITournament } from './interfaces/ITournament';
import { Dayjs } from 'dayjs';

export class Tournament {
  id: string;

  teams: Team[];

  groups: TournamentGroup[];

  state: TournamentState;

  name: string;

  startDate?: Dayjs;

  endDate?: Dayjs;

  settings: TournamentSettings;

  gameSettings: GameSettings;

  constructor(props: ITournament) {
    this.id = props.id;
    this.teams = props.teams || [];
    this.groups = props.groups || [];
    this.state = props.state;
    this.name = props.name;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.settings = props.settings || DefaultTournamentSettings;
    this.gameSettings = props.gameSettings || DefaultGameSettings;
  }
}
