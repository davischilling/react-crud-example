import { Box, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import {
  DEFAULT_STATE,
  EditCategoryUseCase,
  State,
} from '../../../../domain/usecases/category/edit';
import { useFormState } from '../../../@shared/hooks/useFormState';
import { useStatefulUseCase } from '../../../@shared/hooks/useStatefulUc';
import Form from '../components/Form';

export function EditCategoryPage() {
  const id = useParams().id;

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

  const { handleChange, handleToggle, handleSubmit } = useFormState({
    setEntity: useCase.setCategory,
    onToggle: useCase.toggleIsActive,
    onSubmit: useCase.updateCategory,
    submitCallback: () => navigate('/categories'),
    snackMessage: 'Category updated successfully',
  });

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Edit Category</Typography>
          </Box>
        </Box>

        <Form
          isLoading={state.isLoading}
          category={state.category}
          isDisabled={state.isLoading}
          handleToggle={handleToggle}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
}
