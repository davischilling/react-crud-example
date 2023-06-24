import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  DEFAULT_STATE,
  ListCategoriesUseCase,
  State,
} from '../../../../src/domain/usecases/category/list';
import * as useStatefulUseCaseModule from '../../../../src/presentation/@shared/hooks/useStatefulUc';

import { Table, TableProps } from '../../../../src/presentation/modules/category/components/Table';
import { ListCategoryPage } from '../../../../src/presentation/modules/category/pages/list';
import { renderWithProviders } from '../../../utils/render-helper';

jest.mock('recoil', () => ({
  atom: jest.fn().mockReturnValue({
    key: 'ListCategoriesUseCase',
    default: {
      isLoading: true,
      categories: [],
      filteredCategories: [],
    },
  }),
}));

jest.mock('../../../../src/presentation/modules/category/components/Table', () => ({
  Table: jest.fn(({ data, isFetching, handleFilterChange }: TableProps) => (
    <div data-testid="mocked-table">
      Mocked Table Content
      <div>
        {!!isFetching ? (
          <>
            <p>Loading...</p>
          </>
        ) : (
          <>
            {data?.length
              ? data.map((el) => (
                  <p key={el.id} data-testid={`cell-id-${el.id}`}>
                    {el.name}
                  </p>
                ))
              : 'No rows'}
          </>
        )}
        <button
          onClick={() =>
            handleFilterChange({
              quickFilterValues: ['Category 1'],
              items: [],
            })
          }
        >
          filter
        </button>
      </div>
    </div>
  )),
}));

describe('ListCategoryPage', () => {
  let fragment: DocumentFragment;
  let useStatefulUseCaseSpy: jest.SpyInstance;
  let filterCategoriesSpy: jest.SpyInstance;
  const mockedData = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    filterCategoriesSpy = jest.fn();
    useStatefulUseCaseSpy = jest
      .spyOn(useStatefulUseCaseModule as any, 'useStatefulRecoil')
      .mockReturnValue({
        state: {
          isLoading: false,
          filteredCategories: mockedData,
        },
        useCase: {
          filterCategories: filterCategoriesSpy,
        },
      });
    const { asFragment } = renderWithProviders<State>(<ListCategoryPage />, ['/categories'], {
      wrapper: BrowserRouter,
    });
    fragment = asFragment();
  });

  test('renders the "List Categories" page', () => {
    expect(fragment).toMatchSnapshot();
  });

  test('calls useStatefulRecoil with correct params', () => {
    expect(useStatefulUseCaseSpy).toHaveBeenCalledTimes(1);
    expect(useStatefulUseCaseSpy).toHaveBeenCalledWith({
      UseCase: ListCategoriesUseCase,
      recoilState: expect.objectContaining({
        key: 'ListCategoriesUseCase',
        default: {
          isLoading: true,
          categories: [],
          filteredCategories: [],
        },
      }),
    });
  });

  test('renders the "New Category" button', () => {
    const newCategoryButton = screen.getByText('New Category');
    expect(newCategoryButton).toBeInTheDocument();
  });

  test('renders the grid component', async () => {
    const grid = screen.getByTestId('mocked-table');
    expect(grid).toBeInTheDocument();
  });

  test('renders the Table component with correct data', async () => {
    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockedData,
        isFetching: false,
        rowsPerPage: [5, 10, 15, 20],
      }),
      expect.any(Object),
    );
  });

  test('renders the "New Category" button', () => {
    const newCategoryButton = screen.getByText('New Category');
    expect(newCategoryButton).toBeInTheDocument();
  });

  test('renders the grid component', async () => {
    const grid = screen.getByTestId('mocked-table');
    expect(grid).toBeInTheDocument();
  });

  test('renders the Table component with correct data when filtered categories are not empty', async () => {
    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockedData,
        isFetching: false,
        rowsPerPage: [5, 10, 15, 20],
      }),
      expect.any(Object),
    );
  });

  test('renders the component with loading state', async () => {
    useStatefulUseCaseSpy.mockReturnValue({
      state: {
        isLoading: true,
        filteredCategories: [],
      },
      useCase: {},
    });

    const screen = await waitFor(() => render(<ListCategoryPage />, { wrapper: BrowserRouter }));

    const loadingIndicator = screen.getByText('Loading...');
    expect(loadingIndicator).toBeInTheDocument();
  });

  test('renders the component with non-empty filtered categories', async () => {
    jest.clearAllMocks();
    useStatefulUseCaseSpy.mockReturnValue({
      state: {
        isLoading: false,
        filteredCategories: mockedData,
      },
      useCase: {},
    });

    const screen = await waitFor(() => render(<ListCategoryPage />, { wrapper: BrowserRouter }));

    const el1 = screen.getAllByTestId('cell-id-1')[0];
    const el2 = screen.getAllByTestId('cell-id-2')[0];
    const el3 = screen.queryByTestId('cell-id-3');

    expect(el1).toBeInTheDocument();
    expect(el2).toBeInTheDocument();
    expect(el3).not.toBeInTheDocument();
  });

  test('renders the component with empty filtered categories', async () => {
    useStatefulUseCaseSpy.mockReturnValueOnce({
      state: {
        isLoading: false,
        filteredCategories: [],
      },
      useCase: {},
    });

    await waitFor(() => render(<ListCategoryPage />, { wrapper: BrowserRouter }));
    const noDataMessage = screen.getByText('No rows');
    expect(noDataMessage).toBeInTheDocument();
  });

  test('calls filterCategories with correct arguments', async () => {
    const filterBtn = screen.getByText('filter');

    await waitFor(() => {
      fireEvent.click(filterBtn);
    });
    expect(filterCategoriesSpy).toHaveBeenCalledTimes(1);
    expect(filterCategoriesSpy).toHaveBeenCalledWith('Category 1');
  });
});
