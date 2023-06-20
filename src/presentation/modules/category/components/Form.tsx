import { Box, Button, Grid } from '@mui/material';
import { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../../../domain/models/category';
import FormInput from '../../../@shared/components/FormInput';
import FormSwitch from '../../../@shared/components/FormSwitch';

type FormProps = {
  category: Partial<Category>;
  isDisabled: boolean;
  isLoading?: boolean;
  handleToggle: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function Form({
  category,
  isDisabled,
  handleToggle,
  handleChange,
  handleSubmit,
}: FormProps) {
  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <FormInput
            fullWidth
            required
            name="name"
            label="Name"
            value={category.name}
            onChange={handleChange}
          />
          <FormInput
            fullWidth
            required
            name="description"
            label="Description"
            value={category.description}
            onChange={handleChange}
          />

          <FormSwitch
            label="active"
            name="is_active"
            color="secondary"
            onChange={handleToggle}
            checked={category.is_active}
            inputProps={{ 'aria-label': 'controlled' }}
          />

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/categories">
                Back
              </Button>

              <Button variant="contained" color="secondary" type="submit" disabled={isDisabled}>
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
