import { useSnackbar } from 'notistack';
import { ChangeEvent, FormEvent, useCallback } from 'react';

type FormStateProps<Name> = {
  setEntity: ({ name, value }: { name: Name; value: string }) => void;
  onToggle?: (value: boolean) => void;
  onSubmit: () => Promise<void>;
  submitCallback: () => void;
  snackMessage: string;
};

export function useFormState<Name = string>({
  setEntity,
  onToggle,
  onSubmit,
  submitCallback,
  snackMessage,
}: FormStateProps<Name>) {
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEntity({
        name: e.target.name as Name,
        value: e.target.value,
      });
    },
    [setEntity],
  );

  const handleToggle = useCallback((event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onToggle && onToggle(checked);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit();
      submitCallback();
      enqueueSnackbar(snackMessage, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  }, []);

  return { handleChange, handleToggle, handleSubmit };
}
