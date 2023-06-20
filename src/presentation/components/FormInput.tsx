import { FormControl, Grid, TextField, TextFieldProps } from "@mui/material";

type FormInputProps = {
  fullWidth: boolean;
} & TextFieldProps;

export default function FormInput({ fullWidth, ...rest }: FormInputProps) {
  return (
    <Grid item xs={12}>
      <FormControl fullWidth={fullWidth}>
        <TextField {...rest} />
      </FormControl>
    </Grid>
  );
}
