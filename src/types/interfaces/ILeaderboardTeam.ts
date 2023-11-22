import Team from 'types/Team';
import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface ILeaderboardTeam extends PouchDBDto {
  id: string;
  totalWins: number;
  totalLosses: number;
  totalPoints: number;
  rank: number;
  previousRank?: number;
  team: Team;
}
