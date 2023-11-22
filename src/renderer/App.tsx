import { CssBaseline, GlobalStyles, ThemeProvider, alpha } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import HomePage from './pages/HomePage';
import LeaguesPage from './pages/LeaguesPage';
import ScoreboardPage from './pages/ScoreboardPage';
import TeamsPage from './pages/TeamsPage';
import TournamentPage from './pages/TournamentPage';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import { theme } from '../theme/theme';

export default function App() {
  const queryClient = new QueryClient();
  // backgroundColor: alpha(theme.palette.primary.main, 0.5),
  // borderRadius: 5,
  // padding: '2px',
  // margin: '5px',
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '*::-webkit-scrollbar': {
            width: '0.4em',
          },

          '*::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.4),
            borderRadius: '20px',
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        }}
      />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/leagues" element={<LeaguesPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/tournament" element={<TournamentPage />} />
              <Route path="/scoreboard" element={<ScoreboardPage />} />
            </Routes>
          </Layout>
        </Router>

        <ConfirmationModal />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
