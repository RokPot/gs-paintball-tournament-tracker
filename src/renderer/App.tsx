import Layout from './layout/Layout';
import HomePage from './pages/HomePage';
import LeaguePage from './pages/LeaguePage';
import ScoreboardPage from './pages/ScoreboardPage';
import TeamsPage from './pages/TeamsPage';
import TournamentPage from './pages/TournamentPage';
import {
  CssBaseline,
  ThemeOptions,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#8448a9',
    },
    secondary: {
      main: '#3EC300',
    },
  },
  typography: {
    // fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
  },
};

const theme = createTheme(themeOptions);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/leagues" element={<LeaguePage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/tournament" element={<TournamentPage />} />
            <Route path="/scoreboard" element={<ScoreboardPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
