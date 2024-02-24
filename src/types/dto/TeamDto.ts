import { PouchDBDto } from './PouchDBDto';
import { TeamMember } from 'types/TeamMember';

export interface TeamDto extends PouchDBDto {
  id: string;
  teamName: string;
  teamTag: string;
  wins: number;
  loses: number;
  draw: number;
  members: TeamMember[];
  color?: string;
}
