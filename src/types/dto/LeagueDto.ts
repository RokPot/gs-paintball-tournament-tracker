import { PouchDBDto } from './PouchDBDto';
import { LeaderboardTeam } from 'types/LeadeboardTeam';
import { Team } from 'types/Team';
import { Tournament } from 'types/Tournament';

export interface LeagueDto extends PouchDBDto {
  id: string;

  name: string;

  teams?: Team[];

  tournaments?: Tournament[];

  leaderboard?: LeaderboardTeam[];

  teamIds: string[];

  tournamentIds: string[];

  leaderboardTeamIds: string[];

  isLeagueSelected?: boolean;

  activeTournamentId?: string;
}
