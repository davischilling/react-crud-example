import React from 'react';
import { render } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('should render app correctly', () => {
    const { asFragment } = render(<App />);
    expect(asFragment).toMatchSnapshot();
  });
});
