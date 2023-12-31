import { render } from '@testing-library/react';
import { Header } from '../../../../src/presentation/@shared/components/Header';

describe('Header', () => {
  it('should render the header', () => {
    const { asFragment } = render(<Header />);

    expect(asFragment()).toMatchSnapshot();
  });
});
