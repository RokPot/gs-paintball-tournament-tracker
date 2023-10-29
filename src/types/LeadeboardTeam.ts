import { Team } from './Team';
import { ILeaderboardTeam } from './interfaces/ILeaderboardTeam';

export class LeaderboardTeam extends Team {
  totalWins: number;
  totalLosses: number;
  totalPoints: number;
  rank: number;
  previousRank?: number;

  constructor(props: ILeaderboardTeam) {
    super(props);
    this.totalWins = props.totalWins;
    this.totalLosses = props.totalLosses;
    this.totalPoints = props.totalPoints;
    this.rank = props.rank;
    this.previousRank = props.previousRank;
  }
}
