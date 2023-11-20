import { GameSettings } from 'types/GameSettings';
import { LeaderboardTeam } from 'types/LeadeboardTeam';
import { Team } from 'types/Team';
import { TournamentGroup } from 'types/TournamentGroup';
import { TournamentSettings } from 'types/TournamentSettings';
import { TournamentState } from 'types/TournamentState';
import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface ITournament extends PouchDBDto {
  id: string;

  teams?: Team[];

  groups?: TournamentGroup[];

  state: TournamentState;

  name: string;

  startDate?: string;

  endDate?: string;

  settings?: TournamentSettings;

  gameSettings?: GameSettings;

  leaderboard: LeaderboardTeam[];
}
