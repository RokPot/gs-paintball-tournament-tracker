import { PouchDBDto } from './PouchDBDto';
import { GameSettings } from 'types/GameSettings';
import { TournamentGroup } from 'types/TournamentGroup';
import { TournamentSettings } from 'types/TournamentSettings';
import { TournamentState } from 'types/TournamentState';

export interface TournamentDto extends PouchDBDto {
  id: string;

  teamIds: string[];

  groups: TournamentGroup[];

  state: TournamentState;

  name: string;

  startDate?: string;

  endDate?: string;

  settings: TournamentSettings;

  gameSettings: GameSettings;
}
