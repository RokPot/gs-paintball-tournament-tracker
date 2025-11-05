import { TournamentGroupDto } from './dto/TournamentGroupDto';
import Game from './Game';
import { GameState } from './GameState';
import { IRxDB } from './interfaces/IRxDB';
import { ITournamentGroup } from './interfaces/ITournamentGroup';
import Team from './Team';
import { TournamentGroupSettings } from './TournamentGroupSettings';
import { TournamentType } from './TournamentType';

export default class TournamentGroup extends IRxDB {
  id: string;

  groupIndex: number;

  teams: Team[];

  games: Game[];

  groupType: TournamentType;

  settings?: TournamentGroupSettings;

  stage: number;

  constructor(props: ITournamentGroup) {
    super(props._id);
    this.id = props.id;
    this.teams = props.teams || [];
    this.groupIndex = props.groupIndex;
    this.games = props.games;
    this.groupType = props.groupType;
    this.stage = props.stage;
    this.settings = props.settings;
  }

  public get finishedGames(): Game[] {
    return this.games.filter((game) => game.gameState === GameState.finished);
  }

  public toDto = (): TournamentGroupDto => {
    return {
      _id: this._id,
      id: this.id,
      teamIds: this.teams?.map((team) => team._id),
      groupIndex: this.groupIndex,
      groupType: this.groupType,
      gameIds: this.games?.map((game) => game._id),
      stage: this.stage,
      settings: this.settings,
    };
  };
}
