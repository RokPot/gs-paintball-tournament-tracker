import LeaderboardTeam from './LeadeboardTeam';
import Team from './Team';
import Tournament from './Tournament';
import { LeagueDto } from './dto/LeagueDto';
import { ILeague } from './interfaces/ILeague';
import { IRxDB } from './interfaces/IRxDB';

export default class League extends IRxDB {
  id: string;

  name: string;

  teams: Team[];

  tournaments: Tournament[];

  leaderboard: LeaderboardTeam[];

  isLeagueSelected?: boolean;

  activeTournament?: Tournament;

  constructor(props: ILeague) {
    super(props._id);
    this.id = props.id;
    this.name = props.name;
    this.teams = props.teams || [];
    this.tournaments = props.tournaments || [];
    this.leaderboard = props.leaderboard || [];
    this.isLeagueSelected = props.isLeagueSelected;
    this.activeTournament = props.activeTournament;
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
      id: this.id,
      name: this.name,
      teamIds: this.teams.map((team) => team._id),
      tournamentIds: this.tournaments.map((tournament) => tournament._id),
      leaderboardTeamIds: this.leaderboard.map((team) => team._id),
      isLeagueSelected: this.isLeagueSelected,
      activeTournamentId: this.activeTournament?._id,
      // Optionally include full DTOs if needed (for deserialization)
      teams: this.teams.map((team) => team.toDto()),
      tournaments: this.tournaments.map((tournament) => tournament.toDto()),
      leaderboard: this.leaderboard.map((team) => team.toDto()),
    };
  };
}
