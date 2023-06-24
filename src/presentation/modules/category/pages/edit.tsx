import { Box, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { atom } from 'recoil';
import {
  DEFAULT_STATE,
  EditCategoryUseCase,
  State,
} from '../../../../domain/usecases/category/edit';
import { useFormState } from '../../../@shared/hooks/useFormState';
import { useStatefulRecoil } from '../../../@shared/hooks/useStatefulUc';
import Form from '../components/Form';

const EditCategoryAtom = atom<State>({
  key: 'EditCategoryUseCase',
  default: DEFAULT_STATE,
});

export function EditCategoryPage() {
  const id = useParams().id;
  const { state, useCase } = useStatefulRecoil<State, EditCategoryUseCase>({
    UseCase: EditCategoryUseCase,
    recoilState: EditCategoryAtom,
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
