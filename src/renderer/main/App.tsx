import { CssBaseline, GlobalStyles, ThemeProvider, alpha } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ConfirmationModal from '../../components/shared/ConfirmationModal';
import { theme } from '../../theme/theme';
import Layout from '../layout/Layout';
import HomePage from '../pages/HomePage';
import LeaguesPage from '../pages/LeaguesPage';
import ResultsPage from '../pages/ResultsPage';
import ScoreboardPage from '../pages/ScoreboardPage';
import TeamsPage from '../pages/TeamsPage';
import TournamentPage from '../pages/TournamentPage';

const App = () => {
  const queryClient = new QueryClient();
  // backgroundColor: alpha(theme.palette.primary.main, 0.5),
  // borderRadius: 5,
  // padding: '2px',
  // margin: '5px',
  console.log('asd');
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
      <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Routes>
              <Route path="/results" element={<ResultsPage />} />

              <Route path="/" element={<Layout />}>
                <Route path="/" element={<HomePage />} />

                <Route path="/leagues" element={<LeaguesPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/tournament" element={<TournamentPage />} />
                <Route path="/scoreboard" element={<ScoreboardPage />} />
              </Route>
            </Routes>
          </MemoryRouter>

          <ConfirmationModal />
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
export default App;
