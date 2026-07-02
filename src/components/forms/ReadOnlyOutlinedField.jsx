import { FormControl, InputLabel, FilledInput, Input, FormLabel } from "@mui/material";

export const ReadOnlyOutlinedField = ({
    label, value, id
}) => {
   return (
    <FormControl 
      size="small" 
      fullWidth 
      margin="none" 
      sx={{
        '& .MuiInput-root': {
          marginTop: 0,
          }
        }}>
      <FormLabel
        shrink
        htmlFor={id}
        size="small"
        sx={{
          // fontSize: "1rem",
          // marginLeft: 0.5,
          marginBottom: 1,
          // transform: "none",
          // position: "relative",
        }}
      >
        {label}
      </FormLabel>

      <Input
        id={id}
        value={value ?? ""}
        size="medium"
        readOnly
        notched={false}
        sx={{
          marginTop: 0,
          fontSize: '1rem',
          pointerEvents: "none",
        }}
      />
    </FormControl>
  );
}
