import { PouchDBDto } from './PouchDBDto';
import { TournamentScheduleDto } from './TournamentScheduleDto';

export interface TournamentStageDto extends PouchDBDto {
  id: string;
  stage: number;
  groupIds: string[];

  schedule?: TournamentScheduleDto[];
}
