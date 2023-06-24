import { Box, Button, Typography } from '@mui/material';
import { GridFilterModel } from '@mui/x-data-grid';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { atom } from 'recoil';
import {
  DEFAULT_STATE,
  ListCategoriesUseCase,
  State,
} from '../../../../domain/usecases/category/list';
import { useStatefulRecoil } from '../../../@shared/hooks/useStatefulUc';
import { Table } from '../components/Table';

const ListCategoryAtom = atom({
  key: 'ListCategoriesUseCase',
  default: DEFAULT_STATE,
});

export function ListCategoryPage() {
  const { state, useCase } = useStatefulRecoil<State, ListCategoriesUseCase>({
    UseCase: ListCategoriesUseCase,
    recoilState: ListCategoryAtom,
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
        handleDelete={useCallback(useCase.deleteCategory, [])}
        handleFilterChange={useCallback(
          (filterModel: GridFilterModel) =>
            useCase.filterCategories(
              filterModel.quickFilterValues && filterModel.quickFilterValues[0],
            ),
          [],
        )}
      />
    </Box>
  );
}
