import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

import { Category } from '../../../../domain/models/category';

type TableProps = {
  data: Category[] | undefined;
  isFetching: boolean;
  rowsPerPage: number[];
  handleFilterChange: (filterModel: GridFilterModel) => void;
  handleDelete: (id: string) => Promise<void>;
};

export function Table({
  data,
  handleDelete,
  rowsPerPage,
  handleFilterChange,
  isFetching,
}: TableProps) {
  const componentProps = {
    toolbar: {
      showQuickFilter: true,
      quickFilterProps: { debounceMs: 500 },
    },
  };
  const { enqueueSnackbar } = useSnackbar();

  function mapRows(data: Category[]) {
    return data.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: new Date(category.created_at).toLocaleDateString('pt-BR'),
    }));
  }

  const rows: GridRowsProp = data ? mapRows(data) : [];
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: renderLinkToEditPageCell,
    },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'is_active',
      headerName: 'Active',
      flex: 1,
      type: 'boolean',
      renderCell: renderIsActiveCell,
    },
    {
      field: 'created_at',
      headerName: 'CreatedAt',
      flex: 1,
      renderCell: renderEditDateCell,
    },
    {
      field: 'id',
      headerName: 'Actions',
      flex: 1,
      renderCell: renderActionsCell,
    },
  ];

  function renderLinkToEditPageCell(row: GridRenderCellParams) {
    return (
      <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/categories/edit/${row.id}`}>
        <Typography>{row.value}</Typography>
      </Link>
    );
  }

  function renderActionsCell(row: GridRenderCellParams) {
    return (
      <IconButton
        aria-label="delete"
        onClick={() => {
          handleDelete(row.value as string);
          enqueueSnackbar('Category deleted successfully', { variant: 'success' });
        }}
        color="secondary"
        data-testid={`delete-button-${row.id}`}
      >
        <DeleteIcon />
      </IconButton>
    );
  }

  function renderIsActiveCell(row: GridRenderCellParams) {
    return (
      <Typography color={row.value ? 'primary' : 'secondary'}>
        {row.value ? 'Active' : 'Inactive'}
      </Typography>
    );
  }

  function renderEditDateCell(row: GridRenderCellParams) {
    return (
      <div>
        <Typography data-testid={`created-at-cell-${row.id}`}>{row.value}</Typography>
      </div>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: 600 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        slotProps={componentProps}
        slots={{ toolbar: GridToolbar }}
        initialState={{
          pagination: { paginationModel: { pageSize: rowsPerPage[0] } },
        }}
        loading={isFetching}
        pageSizeOptions={rowsPerPage}
        onFilterModelChange={handleFilterChange}
        disableColumnFilter={true}
        disableColumnSelector={true}
        disableDensitySelector={true}
        disableRowSelectionOnClick={true}
      />
    </Box>
  );
}
