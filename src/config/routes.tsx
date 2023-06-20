import { Routes, Route } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { ListCategoryPage } from '../presentation/modules/category/pages/list';
import { CreateCategoryPage } from '../presentation/modules/category/pages/create';
import { EditCategoryPage } from '../presentation/modules/category/pages/edit';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ListCategoryPage />} />
    <Route path="/categories" element={<ListCategoryPage />} />
    <Route path="/categories/create" element={<CreateCategoryPage />} />
    <Route path="/categories/edit/:id" element={<EditCategoryPage />} />
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
