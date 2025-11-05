import Team from 'types/Team';
import { RxDBDto } from 'types/dto/RxDBDto';

export interface ILeaderboardTeam extends RxDBDto {
  id: string;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  totalPoints: number;
  rank: number;
  previousRank?: number;
  team: Team;
}
