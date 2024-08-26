import React, { useMemo } from 'react';
import usePouchDB, { pouchDbName } from 'services/pouchDB';

type PouchDBContextProps = {
  database: PouchDB.Database<{}>;
};

export const PouchDBContext = React.createContext<PouchDBContextProps>({
  database: {} as PouchDB.Database<{}>,
});

const PouchDBProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const database = usePouchDB(pouchDbName);

  const contextValue = useMemo(
    () => ({
      database,
    }),
    [database],
  );
  return (
    <PouchDBContext.Provider value={contextValue}>
      {children}
    </PouchDBContext.Provider>
  );
};

export default PouchDBProvider;
