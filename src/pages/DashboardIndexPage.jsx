import { Box, Typography, Stack, Grid} from "@mui/material";
import { useAuth } from "../auth";
import AccesoRapidoCard from "../components/linksCard/AccesoRapidoCard";
import MensajeriaPanel from "../components/dashboard/MensajeriaPanel";
import PanelLateral from "../components/dashboard/PanelLateral";

export default function DashboardIndexPage() {
    const { user } = useAuth();

    const itemsUsuarioOptions = [
        {label: 'Mi Credencial', path: 'mi-credencial', icon: null, roles: [user?.rol], padding: 4, comingSoon: true},
        {label: 'Mis Haberes', path: 'mi-recibo', icon: null, roles: [user?.rol], padding: 4, comingSoon: true},
    ]

    return (
    <Box sx={{
        bgcolor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        }}  
        width="100%" 
        height="100%" 
        borderRadius={2} 
        p={2} 
        display="flex" 
        gap={2} 
        flexDirection="row" 
        justifyContent="space-between" 
        alignItems="start">
        <Box width={'85%'} height="100%" display="flex" flexDirection="column" alignItems="start" justifyContent="start" gap={2} >
           <Grid container width="100%" height="100%">
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
                        {itemsUsuarioOptions.map((item) => (
                            <AccesoRapidoCard key={item.path} item={item} padding={item.padding} />
                        ))}
                    </Stack>
                </Grid>

                <Grid item size={8} borderRadius={2} px={2}>
                    <MensajeriaPanel />
                </Grid>
            </Grid>
        </Box>

        <PanelLateral />
    </Box>
    )
}