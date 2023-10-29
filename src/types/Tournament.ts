import { Team } from './Team';
import { TournamentGroup } from './TournamentGroup';
import { TournamentState } from './TournamentState';
import { ITournament } from './interfaces/ITournament';

export class Tournament {
  id: string;

  teams: Team[];

  groups: TournamentGroup[];

  state: TournamentState;

  name: string;

  startDate?: Date;

  endDate?: Date;

  constructor(props: ITournament) {
    this.id = props.id;
    this.teams = props.teams || [];
    this.groups = props.groups || [];
    this.state = props.state;
    this.name = props.name;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }
}
