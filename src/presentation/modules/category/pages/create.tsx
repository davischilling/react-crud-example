import { Box, Paper, Typography } from '@mui/material';
import { FormEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../../../domain/models/category';
import { CategoryUseCase, State } from '../../../../domain/usecases/modules/category';
import Form from '../components/Form';
import { useFormState } from '../hooks/useFormState';

type Props = {
  state: State;
  useCase: CategoryUseCase;
};

export function CreateCategoryPage({ state, useCase }: Props) {
  const navigate = useNavigate();

  const { handleChange, handleSubmit } = useFormState({
    setEntity: useCase.setCategory,
    onSubmit: useCase.createCategory,
    submitCallback: () => navigate('/categories'),
  });

  console.log('rendering page');

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create Category</Typography>
          </Box>
        </Box>

        <Form
          category={state.category}
          isDisabled={false}
          handleToggle={useMemo(() => useCase.toggleIsActive, [])}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
}
