import { TournamentType } from 'types/TournamentType';
import { PouchDBDto } from './PouchDBDto';

export interface TournamentGroupDto extends PouchDBDto {
  id: string;

  groupIndex: number;

  teamIds: string[];

  gameIds: string[];

  groupType: TournamentType;

  stage: number;
}
