import { useSnackbar } from 'notistack';
import { ChangeEvent, FormEvent, useEffect, useMemo } from 'react';

type FormStateProps = {
  setEntity: ({ name, value }: { name: any; value: string }) => void;
  onSubmit: () => Promise<void>;
  submitCallback: () => void;
  // snackMessage: string;
  // status: any;
};

export function useFormState({ setEntity, onSubmit, submitCallback }: FormStateProps) {
  // const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEntity({
      name: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = useMemo(
    () => async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await onSubmit();
      submitCallback();
    },
    [],
  );

  // useEffect(() => {
  //   if (status.error) {
  //     enqueueSnackbar('Something went wrong', { variant: 'error' });
  //   }
  //   if (status.isSuccess) {
  //     enqueueSnackbar(snackMessage, { variant: 'success' });
  //   }
  // }, [enqueueSnackbar, status.error, status.isSuccess]);

  return { handleChange, handleSubmit };
}
