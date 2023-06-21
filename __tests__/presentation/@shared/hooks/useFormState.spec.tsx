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
  const setEntity = jest.fn();
  const onToggle = jest.fn();
  const onSubmit = jest.fn();
  const submitCallback = jest.fn();
  const snackMessage = 'Test Snack Message';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call setEntity when handleChange is called', () => {
    const { result } = renderHook(() =>
      useFormState({ setEntity, onSubmit, submitCallback, snackMessage }),
    );
    const { handleChange } = result.current;

    act(() => {
      handleChange({
        target: { name: 'name', value: 'Test Name' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(setEntity).toHaveBeenCalledTimes(1);
    expect(setEntity).toHaveBeenCalledWith({ name: 'name', value: 'Test Name' });
  });

  it('should call onToggle when handleToggle is called', () => {
    const { result } = renderHook(() =>
      useFormState({ setEntity, onToggle, onSubmit, submitCallback, snackMessage }),
    );
    const { handleToggle } = result.current;

    act(() => {
      handleToggle({} as React.ChangeEvent<HTMLInputElement>, true);
    });

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true);

    act(() => {
      handleToggle({} as React.ChangeEvent<HTMLInputElement>, false);
    });

    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('should call onSubmit, submitCallback, and enqueueSnackbar when handleSubmit is called', async () => {
    const { result } = renderHook(() =>
      useFormState({ setEntity, onSubmit, submitCallback, snackMessage }),
    );
    const { handleSubmit } = result.current;
    const { enqueueSnackbar } = useSnackbar();

    await act(async () => {
      await handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(submitCallback).toHaveBeenCalledTimes(1);
    expect(enqueueSnackbar).toHaveBeenCalledWith(snackMessage, { variant: 'success' });
  });

  it('should call enqueueSnackbar with error variant when onSubmit throws an error', async () => {
    const { result } = renderHook(() =>
      useFormState({ setEntity, onSubmit, submitCallback, snackMessage }),
    );
    const { handleSubmit } = result.current;
    const { enqueueSnackbar } = useSnackbar();

    onSubmit.mockRejectedValueOnce(new Error('Test Error'));

    await act(async () => {
      await handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(submitCallback).not.toHaveBeenCalled();
    expect(enqueueSnackbar).toHaveBeenCalledWith('Something went wrong', { variant: 'error' });
  });
});
