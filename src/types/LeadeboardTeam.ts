import Team from './Team';
import { LeaderboardTeamDto } from './dto/LeaderboardTeamDto';
import { ILeaderboardTeam } from './interfaces/ILeaderboardTeam';
import { DocType, IPouchDB } from './interfaces/IPouchDB';

export default class LeaderboardTeam extends IPouchDB {
  id: string;

  totalWins: number;

  totalLosses: number;

  totalDraws: number;

  totalPoints: number;

  margin: number;

  rank: number;

  previousRank?: number;

  team: Team;

  constructor(props: ILeaderboardTeam) {
    super(props._id, props._rev, props.docType || DocType.LeaderboardTeam);
    this.id = props.id;
    this.team = props.team;
    this.totalWins = props.totalWins;
    this.totalLosses = props.totalLosses;
    this.totalDraws = props.totalDraws;
    this.totalPoints = props.totalPoints;
    this.rank = props.rank;
    this.previousRank = props.previousRank;
    this.margin = 0;
  }

  public toDto = (): LeaderboardTeamDto => {
    return {
      _id: this._id,
      _rev: this._rev,
      docType: this.docType,
      id: this.id,
      totalWins: this.totalWins,
      totalLosses: this.totalLosses,
      totalDraws: this.totalDraws,
      totalPoints: this.totalPoints,
      rank: this.rank,
      previousRank: this.previousRank,
      teamId: this.team._id,
    };
  };
}
