import React from 'react';
import { Box, Typography }from '@mui/material';

export const InputWrapper = () => {
  return (
        <Box sx={{width:'100%'}} display={"flex"} bgcolor={'#fff'} borderRadius={1} paddingX={2} paddingY={2} boxShadow={2}>
            <Typography variant="subtitle1">Ingrese los archivos .xlsx y .csv</Typography>
        </Box>
  )
}
