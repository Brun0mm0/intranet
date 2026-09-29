import { Box, Typography, Grid, Stack } from '@mui/material';
import PanelLateral from '../../components/dashboard/PanelLateral';
import ContactosListado from './components/ContactosListado';

export default function ContactosPage() {
    return (
        <Box sx={{
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
        }}
            width="100%"
            flexGrow={1}
            minHeight={0}
            borderRadius={2}
            p={2}
            display="flex"
            gap={2}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="stretch"
        >
            <Box width={'85%'} minHeight={0} display="flex" flexDirection="column" alignItems="start" justifyContent="start" gap={2}>
                <Grid container width="100%" flexGrow={1} minHeight={0}>
                    <Grid
                        item
                        size={4}
                        px={2}
                        borderRight={1}
                        borderColor="#d1d1d1"
                        display="flex"
                        flexDirection="column"
                        height="100%"
                    >
                        <Stack py={4}>
                            <Typography variant="h4" gutterBottom align="center">
                                Bienvenido
                            </Typography>
                        </Stack>
                        <Stack spacing={1} sx={{ mt: 'auto' }}>

                        </Stack>
                    </Grid>

                    <Grid item size={8} borderRadius={2} px={2} height="100%" minHeight={0}>
                        <ContactosListado />
                    </Grid>
                </Grid>
                {/* <Typography width="100%" variant="h3" align="left">Contactos</Typography>
                <Box flexGrow={1} width="100%" display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 480 }}>
                        Acá vas a poder consultar los internos telefónicos de los usuarios y los organigramas de las
                        gerencias. Esta sección está en desarrollo.
                    </Typography>
                </Box> */}
            </Box>

            <PanelLateral />
        </Box>
    );
}
