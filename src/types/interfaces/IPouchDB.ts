export enum DocType {
  Team = 'team',
  Tournament = 'tournament',
  LeaderboardTeam = 'leaderboardTeam',
  League = 'league',
  Game = 'game',
  Group = 'group',
}
export class IPouchDB {
  _id: string;

  _rev?: string;

  docType?: DocType;

  constructor(id: string, rev?: string, docType?: DocType) {
    this._id = id;
    this._rev = rev;
    this.docType = docType;
  }
}
