import { LeaderboardTeam } from './LeadeboardTeam';
import { Team } from './Team';
import { Tournament } from './Tournament';
import { ILeague } from './interfaces/ILeague';

export class League {
  id: string;

  teams: Team[];

  tournaments: Tournament[];

  leaderboard: LeaderboardTeam[];

  constructor(props: ILeague) {
    this.id = props.id;
    this.teams = props.teams;
    this.tournaments = props.tournaments;
    this.leaderboard = props.leaderboard;
  }
}
