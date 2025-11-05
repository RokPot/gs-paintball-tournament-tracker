import ActivityChangeType from 'types/ActivityChangeType';
import Game from 'types/Game';
import { Match } from 'types/Match';
import { RxDBDto } from 'types/dto/RxDBDto';

export interface ITournamentActivity extends RxDBDto {
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
