import { GameSettings } from 'types/GameSettings';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentState from 'types/TournamentState';
import { PouchDBDto } from './PouchDBDto';
import { TournamentScheduleDto } from './TournamentScheduleDto';

export interface TournamentDto extends PouchDBDto {
  id: string;

  teamIds: string[];

  groupIds: string[];

  state: TournamentState;

  name: string;

  startDate?: string;

  endDate?: string;

  settings: TournamentSettings;

  gameSettings: GameSettings;

  leaderboardTeamIds: string[];

  schedule?: TournamentScheduleDto[];

  stages:
}
