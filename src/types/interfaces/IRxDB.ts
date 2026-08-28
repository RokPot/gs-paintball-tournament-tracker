export enum DocType {
  Team = 'team',
  Tournament = 'tournament',
  LeaderboardTeam = 'leaderboardTeam',
  League = 'league',
  Game = 'game',
  Group = 'group',
  TournamentStage = 'tournamentStage',
  TournamentActivity = 'tournamentActivity',
}
export class IRxDB {
  _id: string;

  constructor(id: string) {
    this._id = id;
  }
}
