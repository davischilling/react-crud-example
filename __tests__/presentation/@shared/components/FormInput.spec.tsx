import { render } from '@testing-library/react';
import FormInput from '../../../../src/presentation/@shared/components/FormInput';

describe('FormInput', () => {
  it('should render the FormInput', () => {
    const { asFragment } = render(
      <FormInput fullWidth required name="name" label="Name" value={''} onChange={() => {}} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
