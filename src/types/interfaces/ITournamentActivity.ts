import ActivityChangeType from 'types/ActivityChangeType';
import Game from 'types/Game';
import { Match } from 'types/Match';
import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface ITournamentActivity extends PouchDBDto {
  id: string;

  updatedAt: Date;

  game: Game;

  gameTime?: number;

  match: Match;

  changeType: ActivityChangeType;

  previousTeam1Wins: number;

  previousTeam2Wins: number;

  nextTeam1Wins: number;

  nextTeam2Wins: number;

  stage: number;

  tournamentId: string;
}
