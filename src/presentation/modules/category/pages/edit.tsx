import { Box, Paper, Typography } from '@mui/material';
import Form from '../components/Form';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormState } from '../../../@shared/hooks/useFormState';
import { useEffect } from 'react';
import { useStatefulUseCase } from '../../../@shared/hooks/useStatefulUc';
import {
  EditCategoryUseCase,
  DEFAULT_STATE,
  State,
} from '../../../../domain/usecases/category/edit';

export function EditCategoryPage() {
  const id = useParams().id || '';
  const { state, useCase } = useStatefulUseCase<State, EditCategoryUseCase>({
    UseCase: EditCategoryUseCase,
    DEFAULT_STATE,
    INITIAL_STATE: {
      category: {
        id,
        name: '',
        description: '',
        is_active: true,
      },
    },
  });

  const navigate = useNavigate();

  const { handleChange, handleSubmit } = useFormState({
    setEntity: useCase.setCategory,
    onSubmit: useCase.updateCategory,
    submitCallback: () => navigate('/categories'),
  });

  if (state.isLoading) return null;

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Edit Category</Typography>
          </Box>
        </Box>

        <Form
          isLoading={!state.category}
          category={state.category}
          isDisabled={false}
          handleToggle={useCase.toggleIsActive}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
}
