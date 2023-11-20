import { LeaderboardTeam } from './LeadeboardTeam';
import { Team } from './Team';
import { Tournament } from './Tournament';
import { LeagueDto } from './dto/LeagueDto';
import { ILeague } from './interfaces/ILeague';
import { IPouchDB } from './interfaces/IPouchDB';
import { DocType } from 'services/pouchDB';

export class League extends IPouchDB {
  id: string;

  name: string;

  teams: Team[];

  tournaments: Tournament[];

  leaderboard: LeaderboardTeam[];

  isLeagueSelected?: boolean;

  activeTournament?: Tournament;

  constructor(props: ILeague) {
    super(props._id, props._rev, props.docType || DocType.League);
    this.id = props.id;
    this.name = props.name;
    this.teams = props.teams || [];
    this.tournaments = props.tournaments || [];
    this.leaderboard = props.leaderboard || [];
    this.isLeagueSelected = props.isLeagueSelected;
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
      docType: this.docType,
      id: this.id,
      name: this.name,
      teamIds: this.teams.map((team) => team._id),
      tournamentIds: this.tournaments.map((tournament) => tournament._id),
      leaderboardTeamIds: this.leaderboard.map((tournament) => tournament._id),
      isLeagueSelected: this.isLeagueSelected,
      activeTournamentId: this.activeTournament?._id,
    };
  };
}
