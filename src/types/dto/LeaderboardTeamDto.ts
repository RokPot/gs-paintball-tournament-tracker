import Team from 'types/Team';
import { PouchDBDto } from './PouchDBDto';

export interface LeaderboardTeamDto extends PouchDBDto {
  id: string;
  totalWins: number;
  totalLosses: number;
  totalPoints: number;
  rank: number;
  previousRank?: number;
  teamId: string;
  team?: Team;
}
