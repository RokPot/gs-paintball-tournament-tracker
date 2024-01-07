import * as PouchDB from 'pouchdb-browser';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import plugin from 'pouchdb-upsert';

export const pouchDbName = 'dbVersion3';
export enum DocType {
  Team = 'team',
  Tournament = 'tournament',
  LeaderboardTeam = 'leaderboardTeam',
  League = 'league',
  Game = 'game',
  Group = 'group',
}
PouchDB.default.plugin(plugin);
const usePouchDB = (dbName: string) => {
  const APouchDB = PouchDB.default.defaults({});
  const db = new APouchDB(dbName);

  return db;
};

export default usePouchDB;
