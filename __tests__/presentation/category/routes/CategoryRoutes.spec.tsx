import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CategoryRoutes } from '../../../../src/presentation/modules/category/routes';

jest.mock('axios', () => {
  return {
    __esModule: true,
    default: {
      create: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: [] }),
        post: jest.fn().mockResolvedValue({ data: [] }),
        put: jest.fn().mockResolvedValue({ data: [] }),
        delete: jest.fn().mockResolvedValue({ data: [] }),
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      }),
    },
  };
});

describe('CategoryRoutes', () => {
  test('renders ListCategoryPage by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <CategoryRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('List Categories')).toBeInTheDocument();
  });

  test('renders CreateCategoryPage when the create route is matched', () => {
    render(
      <MemoryRouter initialEntries={['/create']}>
        <CategoryRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('Create Category')).toBeInTheDocument();
  });

  test('renders EditCategoryPage when the edit route with ID is matched', () => {
    render(
      <MemoryRouter initialEntries={['/edit/1']}>
        <CategoryRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('Edit Category')).toBeInTheDocument();
  });

  test('renders NotFoundPage when no route is matched', () => {
    render(
      <MemoryRouter initialEntries={['/invalid']}>
        <CategoryRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('404 - Category Not Found')).toBeInTheDocument();
  });
});
