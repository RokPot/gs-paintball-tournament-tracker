import { CssBaseline, GlobalStyles, ThemeProvider, alpha } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { theme } from '../../theme/theme';
import ResultsPage from '../pages/ResultsPage';

/**
 * This window is display-only: it receives its data over IPC, so it
 * deliberately mounts neither PouchDB/RxDB nor React Query. A second renderer
 * opening the same IndexedDB is what caused "the database connection is
 * closing".
 */
const App = () => {
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
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<ResultsPage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
};
export default App;
