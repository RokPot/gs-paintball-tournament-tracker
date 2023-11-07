import PouchDb, { emit } from 'pouchdb';
import { TeamDto } from 'types/dto/TeamDto';

const usePouchDB = (dbName: string) => {
  const db = new PouchDb(dbName);
  // document that tells PouchDB/CouchDB
  // to build up an index on doc.name
  var ddoc = {
    _id: '_teams/all',
    views: {
      by_name: {
        map: function (doc: TeamDto) {
          emit(doc.teamName);
        }.toString(),
      },
    },
  };
  // save it
  db.put(ddoc)
    .then(function () {
      // success!
    })
    .catch(function (err) {
      // some error (maybe a 409, because it already exists?)
    });
  return db;
};

export default usePouchDB;
