import { Team } from './Team';
import { LeaderboardTeamDto } from './dto/LeaderboardTeamDto';
import { ILeaderboardTeam } from './interfaces/ILeaderboardTeam';
import { IPouchDB } from './interfaces/IPouchDB';

export class LeaderboardTeam extends IPouchDB {
  id: string;
  totalWins: number;
  totalLosses: number;
  totalPoints: number;
  rank: number;
  previousRank?: number;
  team: Team;

  constructor(props: ILeaderboardTeam) {
    super(props._id, props._rev, props.docType || 'leaderboardTeam');
    this.id = props.id;
    this.team = props.team;
    this.totalWins = props.totalWins;
    this.totalLosses = props.totalLosses;
    this.totalPoints = props.totalPoints;
    this.rank = props.rank;
    this.previousRank = props.previousRank;
  }

  public toDto = (): LeaderboardTeamDto => {
    return {
      _id: this._id,
      _rev: this._rev,
      docType: this.docType,
      id: this.id,
      totalWins: this.totalWins,
      totalLosses: this.totalLosses,
      totalPoints: this.totalPoints,
      rank: this.rank,
      previousRank: this.previousRank,
      teamId: this.team._id,
    };
  };
}
