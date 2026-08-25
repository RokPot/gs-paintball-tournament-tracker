import { useMemo } from 'react';
import PouchDB from 'pouchdb-browser';

export const pouchDbName = 'dbVersion5';
// GS Turnir history: dbVersion6

const databases: Record<string, PouchDB.Database> = {};

/**
 * One IndexedDB connection per database name, per renderer. `new PouchDB()` on
 * every React render opens a second connection and PouchDB 8's indexeddb
 * adapter then closes the shared one, which surfaces as:
 * InvalidStateError: The database connection is closing
 * (getMetaDoc / getDocsToPersist / _getLocal).
 */
export const getPouchDB = (dbName: string) => {
  if (!databases[dbName]) {
    databases[dbName] = new PouchDB(dbName);
  }
  return databases[dbName];
};

const usePouchDB = (dbName: string) => {
  return useMemo(() => getPouchDB(dbName), [dbName]);
};

export default usePouchDB;
