import { ITeam } from './ITeam';
import { TeamMember } from 'types/TeamMember';

export interface ILeaderboardTeam extends ITeam {
  id: string;
  teamName: String;
  teamTag: string;
  wins?: number;
  loses?: number;
  draw?: number;
  members: TeamMember[];

  totalWins: number;
  totalLosses: number;
  totalPoints: number;
  rank: number;
  previousRank?: number;
}
