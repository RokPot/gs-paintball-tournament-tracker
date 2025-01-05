import PouchDB from 'pouchdb-browser';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import plugin from 'pouchdb-upsert';

export const pouchDbName = 'dbVersion5';
// GS Turnir history: dbVersion6
const usePouchDB = (dbName: string) => {
  const pouchDB = new PouchDB(dbName);
  // const db = new APouchDB(dbName);

  return pouchDB;
};

export default usePouchDB;
