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
import { Link } from 'react-router-dom';
import { Category } from '../../../../domain/models/category';

type TableProps = {
  // data: Results | undefined;
  data: Category[] | undefined;
  // perPage: number;
  isFetching: boolean;
  rowsPerPage: number[];

  // handleOnPageChange: (page: number) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
  // handleOnPageSizeChange: (perPage: number) => void;
  handleDelete: (id: string) => Promise<void>;
};

export function Table({ data, handleDelete, rowsPerPage, handleFilterChange }: TableProps) {
  const componentProps = {
    toolbar: {
      showQuickFilter: true,
      quickFilterProps: { debounceMs: 500 },
    },
  };

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
      headerName: 'Created At',
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
        onClick={() => handleDelete(row.value as string)}
        color="secondary"
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
    return <Typography>{row.value}</Typography>;
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
