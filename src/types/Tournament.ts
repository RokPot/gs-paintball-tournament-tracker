import { Game } from './Game';
import { Team } from './Team';
import { TeamMember } from './TeamMember';
import { TournamentGroup } from './TournamentGroup';
import { TournamentState } from './TournamentState';
import { ITournament } from './interfaces/ITournament';

export class Tournament {
  id: string;

  teams: Team[];

  groups: TournamentGroup[];

  state: TournamentState;

  constructor(props: ITournament) {
    this.id = props.id;
    this.teams = props.teams;
    this.groups = props.groups;
    this.state = props.state;
  }
}
