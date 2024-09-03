import { CssBaseline, GlobalStyles, ThemeProvider, alpha } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { ErrorBoundary } from 'react-error-boundary';
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

function fallbackRender({ error, resetErrorBoundary }: any) {
  console.log('ERROR MESSAGE ONE TWO ONE TWO');
  alert(error);
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>
        {error.message} Error: {error} {resetErrorBoundary}
      </pre>
    </div>
  );
}
const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <PouchDBProvider>
        <ButtonsProvider>
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
          <ErrorBoundary
            fallbackRender={fallbackRender}
            onReset={(details) => {
              // Reset the state of your app so the error doesn't happen again
              // todo rokpot properly handle crashes
              // eslint-disable-next-line no-console
              console.log(details);
              console.log('RESEEEEEEEEEEEEEEET');
              window.location.reload();
            }}
          >
            <SnackbarProvider
              maxSnack={5}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
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
            </SnackbarProvider>
          </ErrorBoundary>
        </ButtonsProvider>
      </PouchDBProvider>
    </ThemeProvider>
  );
};
export default App;
