import { TournamentGroupSettings } from 'types/TournamentGroupSettings';
import { TournamentType } from 'types/TournamentType';
import { RxDBDto } from './RxDBDto';

export interface TournamentGroupDto extends RxDBDto {
  id: string;

  groupIndex: number;

  teamIds: string[];

  gameIds: string[];

  groupType: TournamentType;

  stage: number;

  settings?: TournamentGroupSettings;
}
