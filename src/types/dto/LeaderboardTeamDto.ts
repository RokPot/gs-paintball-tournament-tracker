import { RxDBDto } from './RxDBDto';
import { TeamDto } from './TeamDto';

export interface LeaderboardTeamDto extends RxDBDto {
  id: string;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  totalPoints: number;
  rank: number;
  previousRank?: number;
  teamId: string;
  team?: TeamDto;
}
