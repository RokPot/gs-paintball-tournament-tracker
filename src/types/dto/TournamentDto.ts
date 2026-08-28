import { GameSettings } from 'types/GameSettings';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentState from 'types/TournamentState';
import { RxDBDto } from './RxDBDto';
import { TournamentScheduleDto } from './TournamentScheduleDto';
import { TournamentStageDto } from './TournamentStageDto';

export interface TournamentDto extends RxDBDto {
  id: string;

  teamIds: string[];

  state: TournamentState;

  name: string;

  startDate?: string;

  endDate?: string;

  settings: TournamentSettings;

  gameSettings: GameSettings;

  leaderboardTeamIds: string[];

  schedule?: TournamentScheduleDto[];

  stageIds: string[]; // Keep for backward compatibility / references

  stages?: TournamentStageDto[]; // Embedded stages array (RxDB)
}
