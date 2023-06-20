import { ThemeProvider, Box } from '@mui/system';
import { appTheme } from './config/theme';
import { AppRoutes } from './config/routes';
import { SnackbarProvider } from 'notistack';
import { Header } from './presentation/@shared/components/Header';
import { Layout } from './presentation/@shared/components/Layout';

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
