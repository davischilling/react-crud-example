import { FormControlLabel, FormGroup, Grid, Switch, SwitchProps } from '@mui/material';

type FormSwitchProps = {
  label: string;
} & SwitchProps;

export default function FormSwitch({ label, ...rest }: FormSwitchProps) {
  return (
    <Grid item xs={12}>
      <FormGroup>
        <FormControlLabel control={<Switch {...rest} />} label={label} />
      </FormGroup>
    </Grid>
  );
}
