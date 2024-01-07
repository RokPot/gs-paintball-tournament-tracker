import { BracketProperties } from 'types/BracketProperties';
import { GameState } from 'types/GameState';
import { Match } from 'types/Match';
import Team from 'types/Team';
import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface IGame extends PouchDBDto {
  id: string;

  team1: Team;

  team2: Team;

  matches: Match[];

  gameState: GameState;

  team1Wins?: number;

  team2Wins?: number;

  bracketProperties: BracketProperties | null;
}
