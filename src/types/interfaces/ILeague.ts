import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import { RxDBDto } from 'types/dto/RxDBDto';

export interface ILeague extends RxDBDto {
  id: string;

  name: string;

  teams?: Team[];

  tournaments?: Tournament[];

  leaderboard?: LeaderboardTeam[];

  isLeagueSelected?: boolean;

  activeTournament?: Tournament;
}
