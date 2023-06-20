import { Routes, Route } from 'react-router-dom';
import { ListCategoryPage } from '../pages/list';
import { CreateCategoryPage } from '../pages/create';
import { EditCategoryPage } from '../pages/edit';
import { Typography, Box } from '@mui/material';
import { useCategoryUseCase } from '../../../config/stores/category';

export function CategoryRoutes() {
  const { state, useCase } = useCategoryUseCase();

  return (
    <Routes>
      <Route path="/" element={<ListCategoryPage state={state} useCase={useCase!} />} />
      <Route path="/create" element={<CreateCategoryPage state={state} useCase={useCase!} />} />
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
