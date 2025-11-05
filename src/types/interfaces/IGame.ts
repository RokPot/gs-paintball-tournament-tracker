import { BracketProperties } from 'types/BracketProperties';
import { GameState, GameWinner } from 'types/GameState';
import { Match } from 'types/Match';
import Team from 'types/Team';
import { RxDBDto } from 'types/dto/RxDBDto';

export interface IGame extends RxDBDto {
  id: string;

  team1: Team;

  team2: Team;

  matches: Match[];

  gameState: GameState;

  team1Wins?: number;

  team2Wins?: number;

  bracketProperties: BracketProperties | null;

  gameTime: number;

  gameWinner?: GameWinner;
}
