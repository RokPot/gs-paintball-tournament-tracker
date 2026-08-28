import LoadingIndicator from 'components/shared/LoadingIndicator';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { RxDatabaseType, getDatabase } from 'services/rxdb/database';
import { Button, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';

type RxDBContextProps = {
  database: RxDatabaseType | null;
  isLoading: boolean;
};

export const RxDBContext = createContext<RxDBContextProps | undefined>(
  undefined,
);

const RxDBProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [database, setDatabase] = useState<RxDatabaseType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeDatabase = async () => {
      try {
        const db = await getDatabase();
        if (isMounted) {
          setDatabase(db);
          setError(null);
          setIsLoading(false);
        }
      } catch (initError) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize RxDB:', initError);
        if (isMounted) {
          setDatabase(null);
          setError(
            initError instanceof Error
              ? initError.message
              : 'Failed to initialize RxDB',
          );
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

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!database) {
    return (
      <FlexContainer
        height="100vh"
        width="100vw"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography variant="h2Medium">Database failed to start</Typography>
        <Typography variant="body2">{error}</Typography>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </FlexContainer>
    );
  }

  return (
    <RxDBContext.Provider value={contextValue}>{children}</RxDBContext.Provider>
  );
};

export const useRxDB = () => {
  const context = useContext(RxDBContext);

  if (!context) {
    throw new Error('useRxDB must be used within RxDBProvider');
  }

  return context;
};

export default RxDBProvider;
