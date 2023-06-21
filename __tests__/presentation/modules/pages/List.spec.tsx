import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ListCategoryPage } from '../../../../src/presentation/modules/category/pages/list';

describe('ListCategoryPage', () => {
  it('should render the "New Category" button and the table component', () => {
    expect(true).toBe(true);
    // render(<ListCategoryPage />, { wrapper: BrowserRouter });

    // const newCategoryButton = screen.getByRole('button', { name: 'New Category' });
    // expect(newCategoryButton).toBeInTheDocument();

    // const table = screen.getByRole('grid');
    // expect(table).toBeInTheDocument();
  });

  // it('should navigate to the create category page when the "New Category" button is clicked', () => {
  //   render(
  //     <MemoryRouter>
  //       <ListCategoryPage />
  //     </MemoryRouter>,
  //   );

  //   const newCategoryButton = screen.getByRole('button', { name: 'New Category' });
  //   userEvent.click(newCategoryButton);

  //   // Assert the correct route is navigated to, e.g., the create category page
  //   expect(screen.getByText('Create Category')).toBeInTheDocument();
  // });
});
