import ActivityChangeType from 'types/ActivityChangeType';
import { Match } from 'types/Match';
import { PouchDBDto } from './PouchDBDto';

export interface TournamentActivityDto extends PouchDBDto {
  id: string;

  updatedAt: string;

  gameTime?: number;

  match: Match;

  gameId: string;

  changeType: ActivityChangeType;

  previousTeam1Wins: number;

  previousTeam2Wins: number;

  nextTeam1Wins: number;

  nextTeam2Wins: number;

  tournamentId: string;

  stage: number;
}
