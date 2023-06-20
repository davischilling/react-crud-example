import { Box, Paper, Typography } from '@mui/material';
import Form from '../components/Form';

export function CreateCategoryPage() {
  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create Category</Typography>
          </Box>
        </Box>

        <Form
          category={{}}
          isDisabled={false}
          handleToggle={() => console.log('handleToggle')}
          handleChange={() => console.log('handleChange')}
          handleSubmit={async () => console.log('handleSubmit')}
        />
      </Paper>
    </Box>
  );
}
