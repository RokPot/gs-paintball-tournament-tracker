import PouchDb from 'pouchdb-browser';
import { useEffect } from 'react';

export const pouchDbName = 'newLeagues3';

const usePouchDB = (dbName: string) => {
  const db = new PouchDb(dbName);
  // document that tells PouchDB/CouchDB
  // to build up an index on doc.name
  useEffect(() => {}, [db]);

  return db;
};

export default usePouchDB;
