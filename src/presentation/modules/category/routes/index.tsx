import { Box, Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { CreateCategoryPage } from '../pages/create';
import { EditCategoryPage } from '../pages/edit';
import { ListCategoryPage } from '../pages/list';

export function CategoryRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ListCategoryPage />} />
      <Route path="/create" element={<CreateCategoryPage />} />
      <Route path="/edit/:id" element={<EditCategoryPage />} />
      <Route
        path="*"
        element={
          <Box>
            <Typography variant="h3" component="h1">
              404 - Category Not Found
            </Typography>
          </Box>
        }
      />
    </Routes>
  );
}
