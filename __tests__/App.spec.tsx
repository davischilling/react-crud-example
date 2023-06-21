import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import App from '../src/App';

describe('App', () => {
  it('renders the app correctly', () => {
    const { asFragment } = render(
      <SnackbarProvider>
        <App />
      </SnackbarProvider>,
      {
        wrapper: BrowserRouter,
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
