import TournamentGroup from 'types/TournamentGroup';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { TournamentType } from 'types/TournamentType';
import { RxDBDto } from 'types/dto/RxDBDto';

export interface ITournamentStage extends RxDBDto {
  id: string;
  stage: number;
  groups: TournamentGroup[];
  schedule: TournamentScheduleGame[];
  stageGamesType: TournamentType;
}
