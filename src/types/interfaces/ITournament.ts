import { Dayjs } from 'dayjs';
import { GameSettings } from 'types/GameSettings';
import { Team } from 'types/Team';
import { TournamentGroup } from 'types/TournamentGroup';
import { TournamentSettings } from 'types/TournamentSettings';
import { TournamentState } from 'types/TournamentState';

export interface ITournament {
  id: string;

  teams?: Team[];

  groups?: TournamentGroup[];

  state: TournamentState;

  name: string;

  startDate?: Dayjs;

  endDate?: Dayjs;

  settings?: TournamentSettings;

  gameSettings?: GameSettings;
}
