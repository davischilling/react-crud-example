import { render } from '@testing-library/react';
import { Layout } from '../../../../src/presentation/@shared/components/Layout';

describe('Layout', () => {
  it('should render the layout', () => {
    const { asFragment } = render(
      <Layout>
        <div>Hello world</div>
      </Layout>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
