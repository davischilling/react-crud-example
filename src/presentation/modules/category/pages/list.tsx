import { Box, Button } from '@mui/material';
import { GridFilterModel } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../../../domain/models/category';
import { CategoryUseCase, State } from '../../../../domain/usecases/modules/category';
import { Table } from '../components/Table';

type Props = {
  state: State;
  useCase: CategoryUseCase;
};

export function ListCategoryPage({ state, useCase }: Props) {
  return (
    <Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
        isFetching={false}
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
