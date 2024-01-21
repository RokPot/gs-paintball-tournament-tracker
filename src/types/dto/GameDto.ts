import { Match } from 'types/Match';
import { GameState } from 'types/GameState';
import { BracketProperties } from 'types/BracketProperties';
import { PouchDBDto } from './PouchDBDto';

export interface GameDto extends PouchDBDto {
  id: string;

  team1Id: string;

  team2Id: string;

  matches: Match[];

  gameState: GameState;

  team1Wins: number;

  team2Wins: number;

  bracketProperties: BracketProperties | null;

  gameTime: number;
}
