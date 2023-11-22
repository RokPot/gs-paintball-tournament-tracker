import { GameState } from 'types/GameState';
import { Match } from 'types/Match';
import Team from 'types/Team';

export interface IGame {
  id: string;
  team1: Team;
  team2: Team;

  matches: Match[];

  gameState: GameState;

  team1Wins?: number;
  team2Wins?: number;
}
