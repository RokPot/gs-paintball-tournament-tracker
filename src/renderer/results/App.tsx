import { CssBaseline, GlobalStyles, ThemeProvider, alpha } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { theme } from '../../theme/theme';
import ResultsPage from '../pages/ResultsPage';

const App = () => {
  const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<ResultsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
export default App;
