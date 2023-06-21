import { Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  CreateCategoryUseCase,
  DEFAULT_STATE,
  State,
} from '../../../../domain/usecases/category/create';
import { useFormState } from '../../../@shared/hooks/useFormState';
import { useStatefulUseCase } from '../../../@shared/hooks/useStatefulUc';
import Form from '../components/Form';

export function CreateCategoryPage() {
  const { state, useCase } = useStatefulUseCase<State, CreateCategoryUseCase>({
    UseCase: CreateCategoryUseCase,
    DEFAULT_STATE,
  });
  const navigate = useNavigate();
  const { handleChange, handleSubmit } = useFormState({
    setEntity: useCase.setCategory,
    onSubmit: useCase.createCategory,
    submitCallback: () => navigate('/categories'),
  });

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
          handleToggle={useCase.toggleIsActive}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
}
