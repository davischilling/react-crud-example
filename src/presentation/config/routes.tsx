import { Box, Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import { CategoryRoutes } from '../modules/category/routes';

export const AppRoutes = () => (
  <Routes>
    <Route path="/categories/*" element={<CategoryRoutes />} />
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
