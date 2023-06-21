import { renderHook, act } from '@testing-library/react';
import { useSnackbar } from 'notistack';
import { useFormState } from '../../../../src/presentation/@shared/hooks/useFormState';

// Mocking the useSnackbar hook
jest.mock('notistack', () => ({
  useSnackbar: jest.fn().mockReturnValue({
    enqueueSnackbar: jest.fn(),
  }),
}));

describe('useFormState', () => {
  it('should call onSubmit, submitCallback, and enqueueSnackbar on form submit', async () => {
    const setEntity = jest.fn();
    const onSubmit = jest.fn().mockResolvedValueOnce({});
    const submitCallback = jest.fn();
    const snackMessage = 'Form submitted successfully';

    const { result } = renderHook(() =>
      useFormState({ setEntity, onSubmit, submitCallback, snackMessage }),
    );

    const { handleSubmit } = result.current;

    await act(async () => {
      await handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(onSubmit).toHaveBeenCalled();
    expect(submitCallback).toHaveBeenCalled();

    const { enqueueSnackbar } = useSnackbar();
    expect(enqueueSnackbar).toHaveBeenCalledWith(snackMessage, {
      variant: 'success',
    });
  });

  it('should display an error snackbar when onSubmit throws an error', async () => {
    const setEntity = jest.fn();
    const onSubmit = jest.fn().mockRejectedValueOnce(new Error('Some error'));
    const submitCallback = jest.fn();

    const { result } = renderHook(() =>
      useFormState({ setEntity, onSubmit, submitCallback, snackMessage: '' }),
    );

    const { handleSubmit } = result.current;

    await act(async () => {
      await handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    const { enqueueSnackbar } = useSnackbar();
    expect(enqueueSnackbar).toHaveBeenCalledWith('Something went wrong', {
      variant: 'error',
    });
  });

  it('should update entity state correctly on input change', () => {
    const setEntity = jest.fn();
    const onSubmit = jest.fn();
    const submitCallback = jest.fn();
    const snackMessage = 'Form submitted successfully';

    const { result } = renderHook(() =>
      useFormState({ setEntity, onSubmit, submitCallback, snackMessage }),
    );

    const { handleChange } = result.current;

    const name = 'firstName';
    const value = 'John';

    act(() => {
      handleChange({
        target: { name, value },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(setEntity).toHaveBeenCalledWith({
      name,
      value,
    });
  });
});
