import dayjs, { Dayjs } from 'dayjs';
import { TeamMember } from './TeamMember';
import { TeamDto } from './dto/TeamDto';
import { DocType, IPouchDB } from './interfaces/IPouchDB';
import { ITeam } from './interfaces/ITeam';

export default class Team extends IPouchDB {
  id: string;

  teamName: string;

  teamTag: string;

  wins: number;

  loses: number;

  draw: number;

  members: TeamMember[];

  color?: string;

  dateCreated: Dayjs;

  constructor(props: ITeam) {
    super(props._id, props._rev, props.docType || DocType.Team);
    this.id = props.id;
    this.teamName = props.teamName;
    this.teamTag = props.teamTag;
    this.wins = props.wins || 0;
    this.loses = props.loses || 0;
    this.draw = props.draw || 0;
    this.members = props.members || [];
    this.color = props.color || '#ffbbff';
    this.dateCreated = props.dateCreated || dayjs();
  }

  public toDto = (): TeamDto => {
    return {
      _id: this._id,
      _rev: this._rev,
      docType: this.docType,
      id: this.id,
      teamName: this.teamName,
      teamTag: this.teamTag,
      wins: this.wins,
      loses: this.loses,
      members: this.members,
      color: this.color,
      draw: this.draw,
    };
  };
}
