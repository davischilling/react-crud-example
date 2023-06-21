import { Box, ThemeProvider } from '@mui/system';
import { SnackbarProvider } from 'notistack';

import { Header } from './presentation/@shared/components/Header';
import { Layout } from './presentation/@shared/components/Layout';
import { AppRoutes } from './presentation/config/routes';
import { appTheme } from './presentation/config/theme';

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <SnackbarProvider
        autoHideDuration={2000}
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box
          component="main"
          sx={{
            height: '100vh',
            backgroundColor: (theme) => theme.palette.grey[900],
          }}
        >
          <Header />
          <Layout>
            <AppRoutes />
          </Layout>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
