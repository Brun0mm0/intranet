import { Box } from '@mui/material';
import React from 'react';
import { InputWrapper } from './components/InputWrapper';

export const AvisoPagoPage = () => {
  return (
    <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'start',
                textAlign: 'center',
                width: '100%',
                px: 1,
                // pt: 5
            }}
        >
            <InputWrapper />
        </Box>
  )
}
