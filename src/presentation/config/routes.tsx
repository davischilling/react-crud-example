import { Routes, Route } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { CategoryRoutes } from '../modules/category/routes';

export const AppRoutes = () => (
  <Routes>
    <Route
      path="/categories/*"
      element={
        // <CategoryProvider>
        <CategoryRoutes />
        // </CategoryProvider>
      }
    />
    <Route
      path="*"
      element={
        <Box>
          <Typography variant="h3" component="h1">
            404 - Not Found
          </Typography>
        </Box>
      }
    />
  </Routes>
);
