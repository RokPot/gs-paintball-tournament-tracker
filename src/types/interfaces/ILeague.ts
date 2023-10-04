import { LeaderboardTeam } from 'types/LeadeboardTeam';
import { Team } from 'types/Team';
import { Tournament } from 'types/Tournament';

export interface ILeague {
  id: string;

  teams: Team[];

  tournaments: Tournament[];

  leaderboard: LeaderboardTeam[];
}
