import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Table } from '../components/Table';
import { useCategoryUseCase } from '../store';

export function ListCategoryPage() {
  const { state, useCase } = useCategoryUseCase();

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
        data={state.categories}
        perPage={1}
        isFetching={false}
        rowsPerPage={[5, 10, 15, 20]}
        handleDelete={async () => console.log('handleDelete')}
        handleOnPageChange={() => console.log('handleOnPageChange')}
        handleOnPageSizeChange={() => console.log('handleOnPageSizeChange')}
        handleFilterChange={() => console.log('handleFilterChange')}
      />
    </Box>
  );
}
