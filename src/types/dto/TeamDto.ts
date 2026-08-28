import { TeamMember } from 'types/TeamMember';
import { RxDBDto } from './RxDBDto';

export interface TeamDto extends RxDBDto {
  id: string;
  teamName: string;
  teamTag: string;
  wins: number;
  loses: number;
  draw: number;
  members: TeamMember[];
  color?: string;
  createdAt: string;
}
