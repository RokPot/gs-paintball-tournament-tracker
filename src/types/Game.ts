import { DocType } from 'services/pouchDB';
import { BracketProperties } from './BracketProperties';
import { GameState } from './GameState';
import { Match } from './Match';
import Team from './Team';
import { GameDto } from './dto/GameDto';
import { IGame } from './interfaces/IGame';
import { IPouchDB } from './interfaces/IPouchDB';

export default class Game extends IPouchDB {
  id: string;

  team1: Team;

  team2: Team;

  matches: Match[];

  gameState: GameState;

  team1Wins: number;

  team2Wins: number;

  bracketProperties: BracketProperties | null;

  constructor(props: IGame) {
    super(props._id, props._rev, props.docType || DocType.Game);

    this.id = props.id;
    this.team1 = props.team1;
    this.team2 = props.team2;
    this.matches = props.matches;
    this.gameState = props.gameState;
    this.team1Wins = props.team1Wins || 0;
    this.team2Wins = props.team2Wins || 0;
    this.bracketProperties = props.bracketProperties;
  }

  public toDto = (): GameDto => {
    return {
      _id: this._id,
      _rev: this._rev,
      docType: this.docType,
      id: this.id,
      team1Id: this.team1._id,
      team2Id: this.team2._id,
      bracketProperties: this.bracketProperties,
      gameState: this.gameState,
      matches: this.matches,
      team1Wins: this.team1Wins,
      team2Wins: this.team2Wins,
    };
  };
}
