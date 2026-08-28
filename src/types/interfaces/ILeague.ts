import { Dayjs } from 'dayjs';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import { RxDBDto } from 'types/dto/RxDBDto';

export interface ILeague extends RxDBDto {
  id: string;

  name: string;

  createdAt?: Dayjs | string;

  teams?: Team[];

  tournaments?: Tournament[];

  leaderboard?: LeaderboardTeam[];

  activeTournament?: Tournament;
}
