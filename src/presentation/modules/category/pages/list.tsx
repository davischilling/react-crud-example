import { Box, Button, Typography } from '@mui/material';
import { GridFilterModel } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import {
  DEFAULT_STATE,
  ListCategoriesUseCase,
  State,
} from '../../../../domain/usecases/category/list';
import { useStatefulUseCase } from '../../../@shared/hooks/useStatefulUc';
import { Table } from '../components/Table';

export function ListCategoryPage() {
  const { state, useCase } = useStatefulUseCase<State, ListCategoriesUseCase>({
    UseCase: ListCategoriesUseCase,
    DEFAULT_STATE,
  });

  return (
    <Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box p={2}>
        <Box mb={2}>
          <Typography variant="h4">List Categories</Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/categories/create"
          style={{ marginBottom: '1rem' }}
        >
          New Category
        </Button>
      </Box>

      <Table
        data={state.filteredCategories}
        isFetching={state.isLoading}
        rowsPerPage={[5, 10, 15, 20]}
        handleDelete={useMemo(() => useCase.deleteCategory, [])}
        handleFilterChange={useMemo(
          () => (filterModel: GridFilterModel) =>
            useCase.filterCategories(
              filterModel.quickFilterValues && filterModel.quickFilterValues[0],
            ),
          [],
        )}
      />
    </Box>
  );
}
