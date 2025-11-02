import { GameSettings } from 'types/GameSettings';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentState from 'types/TournamentState';
import { PouchDBDto } from './PouchDBDto';
import { TournamentScheduleDto } from './TournamentScheduleDto';
import { TournamentStageDto } from './TournamentStageDto';

export interface TournamentDto extends PouchDBDto {
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
