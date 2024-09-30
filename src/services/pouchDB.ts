import * as PouchDB from 'pouchdb-browser';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import plugin from 'pouchdb-upsert';

export const pouchDbName = 'dbVersion6';
// GS Turnir history: dbVersion6
PouchDB.default.plugin(plugin);
const usePouchDB = (dbName: string) => {
  const APouchDB = PouchDB.default.defaults({});
  const db = new APouchDB(dbName);

  return db;
};

export default usePouchDB;
