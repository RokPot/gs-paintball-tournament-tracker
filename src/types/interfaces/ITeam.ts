import { Dayjs } from 'dayjs';
import { TeamMember } from 'types/TeamMember';
import { RxDBDto } from 'types/dto/RxDBDto';

export interface ITeam extends RxDBDto {
  id: string;
  teamName: string;
  teamTag: string;
  wins?: number;
  loses?: number;
  draw?: number;
  members?: TeamMember[];
  color?: string;
  dateCreated?: Dayjs;
}
