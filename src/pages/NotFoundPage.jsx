// src/pages/NotFoundPage.jsx
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Página no encontrada
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        La página que estás buscando no existe o fue movida.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Volver al inicio
      </Button>
    </Box>
  );
}
