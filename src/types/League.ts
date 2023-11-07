import { LeaderboardTeam } from './LeadeboardTeam';
import { Team } from './Team';
import { Tournament } from './Tournament';
import { LeagueDto } from './dto/LeagueDto';
import { ILeague } from './interfaces/ILeague';
import { IPouchDB } from './interfaces/IPouchDB';

export class League extends IPouchDB {
  id: string;

  name: string;

  teams: Team[];

  tournaments: Tournament[];

  leaderboard: LeaderboardTeam[];

  isLeagueSelected?: boolean;

  constructor(props: ILeague) {
    super(props._id, props._rev, 'league');
    this.id = props.id;
    this.name = props.name;
    this.teams = props.teams;
    this.tournaments = props.tournaments;
    this.leaderboard = props.leaderboard;
  }

  public addLeaderboardTeam = (leaderboardTeam: LeaderboardTeam) => {
    this.leaderboard = [...this.leaderboard, leaderboardTeam];
  };

  public addTeam = (team: Team) => {
    this.teams = [...this.teams, team];
  };

  public toDto = (): LeagueDto => {
    return {
      _id: this._id,
      _rev: this._rev,
      id: this.id,
      name: this.name,
      teams: this.teams,
      tournaments: this.tournaments,
      leaderboard: this.leaderboard,
    };
  };
}
