import TournamentGroup from 'types/TournamentGroup';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface ITournamentStage extends PouchDBDto {
  id: string;
  stage: number;
  groups: TournamentGroup[];
  schedule: TournamentScheduleGame[];
}
