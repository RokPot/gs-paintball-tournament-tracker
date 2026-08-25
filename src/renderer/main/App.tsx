import {
  Button,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  Typography,
  alpha,
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorPlaceholderIcon from 'assets/icons/ErrorPlaceholder';
import FlexContainer from 'components/shared/FlexContainer';
import { SnackbarProvider } from 'notistack';
import { useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ButtonsProvider from 'store/ButtonsContext';
import PouchDBProvider from 'store/PouchDBContext';
import TournamentProvider from 'store/TournamentContext';
import ConfirmationModal from '../../components/shared/ConfirmationModal';
import { theme } from '../../theme/theme';
import Layout from '../layout/Layout';
import HomePage from '../pages/HomePage';
import LeaguesPage from '../pages/LeaguesPage';
import ScoreboardPage from '../pages/ScoreboardPage';
import TeamsPage from '../pages/TeamsPage';
import TournamentPage from '../pages/TournamentPage';
import routes from './Routes';

const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <FlexContainer
      height="100vh"
      width="100vw"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <div style={{ width: '500px', height: '500px' }}>
        <ErrorPlaceholderIcon />
      </div>
      <Typography variant="h2Medium">Something went wrong</Typography>
      <Typography variant="body2">{error.message}</Typography>
      <Button
        onClick={() => {
          resetErrorBoundary();
        }}
      >
        Go Back
      </Button>
    </FlexContainer>
  );
};

const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '*::-webkit-scrollbar': {
            width: '0.4em',
            height: '0.4em',
          },

          '*::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.6),
            borderRadius: '20px',
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
          },
        }}
      />

      <ErrorBoundary fallbackRender={Fallback}>
        <PouchDBProvider>
          <SnackbarProvider
            maxSnack={5}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            autoHideDuration={}
          >
            <ButtonsProvider>
              <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                  <TournamentProvider>
                    <Routes>
                      <Route path={routes.HOME} element={<Layout />}>
                        <Route path={routes.HOME} element={<HomePage />} />

                        <Route
                          path={routes.LEAGUES}
                          element={<LeaguesPage />}
                        />
                        <Route path={routes.TEAMS} element={<TeamsPage />} />
                        <Route
                          path={routes.TOURNAMENT}
                          element={<TournamentPage />}
                        />
                        <Route
                          path={routes.SCOREBOARD}
                          element={<ScoreboardPage />}
                        />
                      </Route>
                    </Routes>
                  </TournamentProvider>
                </MemoryRouter>

                <ConfirmationModal />
              </QueryClientProvider>
            </ButtonsProvider>
          </SnackbarProvider>
        </PouchDBProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};
export default App;
