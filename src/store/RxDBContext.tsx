import React, { createContext, useContext, useEffect, useState } from 'react';
import { RxDatabaseType, getDatabase } from 'services/rxdb/database';

type RxDBContextProps = {
  database: RxDatabaseType | null;
  isLoading: boolean;
};

export const RxDBContext = createContext<RxDBContextProps>({
  database: null,
  isLoading: true,
});

/**
 * RxDB Provider Component
 *
 * Provides RxDB database instance to all child components.
 * Similar to PouchDBProvider but for RxDB.
 *
 * Usage:
 * <RxDBProvider>
 *   <YourApp />
 * </RxDBProvider>
 */
const RxDBProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [database, setDatabase] = useState<RxDatabaseType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeDatabase = async () => {
      try {
        const db = await getDatabase();
        if (isMounted) {
          setDatabase(db);
          setIsLoading(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize RxDB:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeDatabase();

    return () => {
      isMounted = false;
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({
      database,
      isLoading,
    }),
    [database, isLoading],
  );

  return (
    <RxDBContext.Provider value={contextValue}>{children}</RxDBContext.Provider>
  );
};

/**
 * Hook to access RxDB context
 *
 * Usage:
 * const { database, isLoading } = useRxDB();
 */
export const useRxDB = () => {
  const context = useContext(RxDBContext);

  if (context === undefined) {
    throw new Error('useRxDB must be used within RxDBProvider');
  }

  return context;
};

export default RxDBProvider;
