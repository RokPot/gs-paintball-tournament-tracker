import { LeaderboardTeam } from 'types/LeadeboardTeam';
import { Team } from 'types/Team';
import { Tournament } from 'types/Tournament';
import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface ILeague extends PouchDBDto {
  id: string;

  name: string;

  teams?: Team[];

  tournaments?: Tournament[];

  leaderboard?: LeaderboardTeam[];
}
