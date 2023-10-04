import { TeamMember } from './TeamMember';
import { ITeam } from './interfaces/ITeam';

export class Team {
  id: string;
  teamName: String;
  teamTag: string;
  wins: number;
  loses: number;
  draw: number;
  members: TeamMember[];

  constructor(props: ITeam) {
    this.id = props.id;
    this.teamName = props.teamName;
    this.teamTag = props.teamTag;
    this.wins = props.wins || 0;
    this.loses = props.loses || 0;
    this.draw = props.draw || 0;
    this.members = props.members;
  }
}
