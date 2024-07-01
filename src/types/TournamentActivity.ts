import Game from './Game';
import { DocType, IPouchDB } from './interfaces/IPouchDB';
import ActivityChangeType from './ActivityChangeType';
import { ITournamentActivity } from './interfaces/ITournamentActivity';
import { TournamentActivityDto } from './dto/TournamentActivityDto';

export default class TournamentActivity extends IPouchDB {
  id: string;

  updatedAt: Date;

  game: Game;

  changeType: ActivityChangeType;

  gameTime?: number;

  previousTeam1Wins: number;

  previousTeam2Wins: number;

  nextTeam1Wins: number;

  nextTeam2Wins: number;

  stage: number;

  tournamentId: string;

  constructor(props: ITournamentActivity) {
    super(props._id, props._rev, props.docType || DocType.TournamentActivity);
    this.id = props.id;
    this.updatedAt = props.updatedAt;
    this.game = props.game;
    this.changeType = props.changeType;
    this.previousTeam1Wins = props.previousTeam1Wins;
    this.previousTeam2Wins = props.previousTeam2Wins;
    this.nextTeam1Wins = props.nextTeam1Wins;
    this.nextTeam2Wins = props.nextTeam2Wins;
    this.tournamentId = props.tournamentId;
    this.gameTime = props.gameTime;
    this.stage = props.stage;
  }

  public toDto = (): TournamentActivityDto => {
    return {
      _id: this._id,
      _rev: this._rev,
      docType: this.docType,
      id: this.id,
      updatedAt: this.updatedAt,
      gameId: this.game._id,
      changeType: this.changeType,
      previousTeam1Wins: this.previousTeam1Wins,
      previousTeam2Wins: this.previousTeam2Wins,
      nextTeam1Wins: this.nextTeam1Wins,
      nextTeam2Wins: this.nextTeam2Wins,
      tournamentId: this.tournamentId,
      gameTime: this.game.gameTime,
      stage: this.stage,
    };
  };
}
