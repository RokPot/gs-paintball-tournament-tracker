import { TournamentType } from 'types/TournamentType';
import { PouchDBDto } from './PouchDBDto';
import { TournamentGroupDto } from './TournamentGroupDto';
import { TournamentScheduleDto } from './TournamentScheduleDto';

export interface TournamentStageDto extends PouchDBDto {
  id: string;
  stage: number;
  groupIds: string[]; // Keep for backward compatibility / references
  stageGamesType: TournamentType;
  schedule?: TournamentScheduleDto[];
  groups?: TournamentGroupDto[]; // Embedded groups array (RxDB)
}
