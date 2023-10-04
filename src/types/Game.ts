import { GameState } from './GameState';
import { Match } from './Match';
import { Team } from './Team';
import { TeamMember } from './TeamMember';
import { TournamentGroup } from './TournamentGroup';
import { IGame } from './interfaces/IGame';

export class Game {
  id: string;
  team1: Team;
  team2: Team;

  matches: Match[];

  gameState: GameState;

  team1Wins: number;
  team2Wins: number;

  group: TournamentGroup;

  constructor(props: IGame) {
    this.id = props.id;
    this.team1 = props.team1;
    this.team2 = props.team2;
    this.matches = props.matches;
    this.gameState = props.gameState;
    this.team1Wins = props.team1Wins || 0;
    this.team2Wins = props.team2Wins || 0;
    this.group = props.group || 0;
  }
}
