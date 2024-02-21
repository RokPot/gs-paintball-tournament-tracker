import Game from './Game';
import Team from './Team';
import { TournamentType } from './TournamentType';
import { DocType, IPouchDB } from './interfaces/IPouchDB';
import { ITournamentGroup } from './interfaces/ITournamentGroup';
import { TournamentGroupDto } from './dto/TournamentGroupDto';

export default class TournamentGroup extends IPouchDB {
  id: string;

  groupIndex: number;

  teams: Team[];

  games: Game[];

  groupType: TournamentType;

  stage: number;

  constructor(props: ITournamentGroup) {
    super(props._id, props._rev, props.docType || DocType.Group);
    this.id = props.id;
    this.teams = props.teams || [];
    this.groupIndex = props.groupIndex;
    this.games = props.games;
    this.groupType = props.groupType;
    this.stage = props.stage;
  }

  public toDto = (): TournamentGroupDto => {
    return {
      _id: this._id,
      _rev: this._rev,
      docType: this.docType,
      id: this.id,
      teamIds: this.teams?.map((team) => team._id),
      groupIndex: this.groupIndex,
      groupType: this.groupType,
      gameIds: this.games?.map((game) => game._id),
      stage: this.stage,
    };
  };
}
