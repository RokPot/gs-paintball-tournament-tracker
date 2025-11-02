import { LeaderboardTeamDto } from './LeaderboardTeamDto';
import { PouchDBDto } from './PouchDBDto';
import { TeamDto } from './TeamDto';
import { TournamentDto } from './TournamentDto';

export interface LeagueDto extends PouchDBDto {
  id: string;

  name: string;

  teams?: TeamDto[];

  tournaments?: TournamentDto[];

  leaderboard?: LeaderboardTeamDto[];

  teamIds: string[];

  tournamentIds: string[];

  leaderboardTeamIds: string[];

  isLeagueSelected?: boolean;

  activeTournamentId?: string;
}
