import { Routes, Route } from 'react-router-dom';
import { ListCategoryPage } from '../pages/list';
import { CreateCategoryPage } from '../pages/create';
import { EditCategoryPage } from '../pages/edit';
import { Typography, Box } from '@mui/material';
import { CategoryProvider } from '../store';

export function CategoryRoutes() {
  return (
    <CategoryProvider>
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
    </CategoryProvider>
  );
}
