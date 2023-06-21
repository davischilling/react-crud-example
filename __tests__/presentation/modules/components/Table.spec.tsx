import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import { useSnackbar } from 'notistack';
import { Category } from '../../../../src/domain/models/category';
import { Table } from '../../../../src/presentation/modules/category/components/Table';

jest.mock('notistack', () => ({
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: jest.fn(),
  })),
}));

const date1 = 'Tue Jun 20 2023 23:40:52 GMT-0300 (Brasilia Standard Time)';
const date2 = 'Tue Jun 21 2023 23:49:43 GMT-0300 (Brasilia Standard Time)';
const mockData: Category[] = [
  {
    id: '1',
    name: 'Category 1',
    description: 'Description 1',
    is_active: true,
    created_at: new Date(date1).toString(),
    updated_at: new Date(date1).toString(),
    deleted_at: null,
  },
  {
    id: '2',
    name: 'Category 2',
    description: 'Description 2',
    is_active: false,
    created_at: new Date(date2).toString(),
    updated_at: new Date(date2).toString(),
    deleted_at: null,
  },
];

const mockHandleDelete = jest.fn();

describe('Table', () => {
  it('should correcly render Table component', async () => {
    const { asFragment } = render(
      <Table
        data={mockData}
        isFetching={false}
        rowsPerPage={[5, 10, 25]}
        handleFilterChange={() => {}}
        handleDelete={mockHandleDelete}
      />,
      { wrapper: BrowserRouter },
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the table with correct data', async () => {
    const screen = render(
      <Table
        data={mockData}
        isFetching={false}
        rowsPerPage={[5, 10, 25]}
        handleFilterChange={() => {}}
        handleDelete={mockHandleDelete}
      />,
      { wrapper: BrowserRouter },
    );

    const nameCell1 = screen.getByText('Category 1');
    const descriptionCell1 = screen.getByText('Description 1');
    const activeCell1 = screen.getByText((content, element) => {
      return content === 'Active' && element?.tagName.toLowerCase() === 'p';
    });
    const nameCell2 = screen.getByText('Category 2');
    const descriptionCell2 = screen.getByText('Description 2');
    const inactiveCell2 = screen.getByText((content, element) => {
      return content === 'Inactive' && element?.tagName.toLowerCase() === 'p';
    });
    expect(nameCell1).toBeInTheDocument();
    expect(descriptionCell1).toBeInTheDocument();
    expect(activeCell1).toBeInTheDocument();
    expect(nameCell2).toBeInTheDocument();
    expect(descriptionCell2).toBeInTheDocument();
    expect(inactiveCell2).toBeInTheDocument();
  });
});
