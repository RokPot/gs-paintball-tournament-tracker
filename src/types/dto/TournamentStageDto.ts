import { TournamentType } from 'types/TournamentType';
import { RxDBDto } from './RxDBDto';
import { TournamentGroupDto } from './TournamentGroupDto';
import { TournamentScheduleDto } from './TournamentScheduleDto';

export interface TournamentStageDto extends RxDBDto {
  id: string;
  stage: number;
  groupIds: string[]; // Keep for backward compatibility / references
  stageGamesType: TournamentType;
  schedule?: TournamentScheduleDto[];
  groups?: TournamentGroupDto[]; // Embedded groups array (RxDB)
}
