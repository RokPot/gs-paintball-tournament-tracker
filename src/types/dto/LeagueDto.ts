import { LeaderboardTeamDto } from './LeaderboardTeamDto';
import { RxDBDto } from './RxDBDto';
import { TeamDto } from './TeamDto';
import { TournamentDto } from './TournamentDto';

export interface LeagueDto extends RxDBDto {
  id: string;

  name: string;

  createdAt: string;

  teams?: TeamDto[];

  tournaments?: TournamentDto[];

  leaderboard?: LeaderboardTeamDto[];

  teamIds: string[];

  tournamentIds: string[];

  leaderboardTeamIds: string[];

  activeTournamentId?: string;
}
