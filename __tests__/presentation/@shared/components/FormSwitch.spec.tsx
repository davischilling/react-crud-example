import { render } from '@testing-library/react';
import FormSwitch from '../../../../src/presentation/@shared/components/FormSwitch';

describe('FormSwitch', () => {
  it('should render the FormSwitch', () => {
    const { asFragment } = render(
      <FormSwitch
        label="active"
        name="is_active"
        color="secondary"
        onChange={() => {}}
        checked={true}
        inputProps={{ 'aria-label': 'controlled' }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
