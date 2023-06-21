import { useSnackbar } from 'notistack';
import { ChangeEvent, FormEvent, useMemo } from 'react';

type FormStateProps<Name> = {
  setEntity: ({ name, value }: { name: Name; value: string }) => void;
  onSubmit: () => Promise<void>;
  submitCallback: () => void;
  snackMessage: string;
};

export function useFormState<Name = string>({
  setEntity,
  onSubmit,
  submitCallback,
  snackMessage,
}: FormStateProps<Name>) {
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEntity({
      name: e.target.name as Name,
      value: e.target.value,
    });
  };

  const handleSubmit = useMemo(
    () => async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await onSubmit();
        submitCallback();
        enqueueSnackbar(snackMessage, { variant: 'success' });
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      }
    },
    [],
  );

  return { handleChange, handleSubmit };
}
