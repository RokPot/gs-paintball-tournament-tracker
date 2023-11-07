import { TeamMember } from 'types/TeamMember';
import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface ITeam extends PouchDBDto {
  id: string;
  teamName: String;
  teamTag: string;
  wins?: number;
  loses?: number;
  draw?: number;
  members?: TeamMember[];
  color?: string;
}
