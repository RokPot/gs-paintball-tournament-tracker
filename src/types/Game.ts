import { BracketProperties } from './BracketProperties';
import { GameState, GameWinner } from './GameState';
import { Match } from './Match';
import Team from './Team';
import { GameDto } from './dto/GameDto';
import { IGame } from './interfaces/IGame';
import { IRxDB } from './interfaces/IRxDB';

export default class Game extends IRxDB {
  id: string;

  team1: Team;

  team2: Team;

  matches: Match[];

  gameState: GameState;

  gameWinner: GameWinner;

  team1Wins: number;

  team2Wins: number;

  bracketProperties: BracketProperties | null;

  gameTime: number;

  constructor(props: IGame) {
    super(props._id);

    this.id = props.id;
    this.team1 = props.team1;
    this.team2 = props.team2;
    this.matches = props.matches;
    this.gameState = props.gameState;
    this.team1Wins = props.team1Wins || 0;
    this.team2Wins = props.team2Wins || 0;
    this.bracketProperties = props.bracketProperties;
    this.gameTime = props.gameTime;
    this.gameWinner = props.gameWinner || GameWinner.notYet;
  }

  public toDto = (): GameDto => {
    return {
      _id: this._id,

      id: this.id,
      team1Id: this.team1._id,
      team2Id: this.team2._id,
      bracketProperties: this.bracketProperties,
      gameState: this.gameState,
      matches: this.matches,
      team1Wins: this.team1Wins,
      team2Wins: this.team2Wins,
      gameTime: this.gameTime,
      gameWinner: this.gameWinner,
    };
  };
}
