import { GameSettings } from 'types/GameSettings';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentState from 'types/TournamentState';
import { PouchDBDto } from './PouchDBDto';

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

  scheduleIds?: string[];
}
