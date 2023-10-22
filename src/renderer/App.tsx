import Layout from './layout/Layout';
import HomePage from './pages/HomePage';
import LeaguesPage from './pages/LeaguesPage';
import ScoreboardPage from './pages/ScoreboardPage';
import TeamsPage from './pages/TeamsPage';
import TournamentPage from './pages/TournamentPage';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { theme } from 'theme/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}
