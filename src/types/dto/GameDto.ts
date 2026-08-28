import { BracketProperties } from 'types/BracketProperties';
import { GameState, GameWinner } from 'types/GameState';
import { Match } from 'types/Match';
import { RxDBDto } from './RxDBDto';

export interface GameDto extends RxDBDto {
  id: string;

  team1Id: string;

  team2Id: string;

  matches: Match[];

  gameState: GameState;

  team1Wins: number;

  team2Wins: number;

  bracketProperties: BracketProperties | null;

  gameTime: number;

  gameWinner: GameWinner;
}
