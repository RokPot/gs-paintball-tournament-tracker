import PouchDb from 'pouchdb-browser';

export const pouchDbName = 'dbVersion1';
export enum DocType {
  Team = 'team',
  Tournament = 'tournament',
  LeaderboardTeam = 'leaderboardTeam',
  League = 'league',
}

const usePouchDB = (dbName: string) => {
  const db = new PouchDb(dbName);

  return db;
};

export default usePouchDB;
