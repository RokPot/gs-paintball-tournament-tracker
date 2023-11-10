import PouchDb from 'pouchdb-browser';

export const pouchDbName = 'newLeagues3';

const usePouchDB = (dbName: string) => {
  const db = new PouchDb(dbName);

  return db;
};

export default usePouchDB;
