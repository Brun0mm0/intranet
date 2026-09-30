import { Box, Stack, Typography, Avatar } from "@mui/material";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";

const MENSAJE_BIENVENIDA = {
    titulo: "Bienvenido a Novedades",
    cuerpo:
        "Esta sección está en desarrollo. Muy pronto vas a poder recibir acá avisos, " +
        "novedades y comunicaciones importantes de la obra social. Mientras se termina " +
        "de conectar con el sistema, este espacio va a mostrar solo este mensaje.",
};

export default function MensajeriaPanel() {
    return (
        <Box height="100%" display="flex" flexDirection="column" width="100%">
            <Box flexGrow={1} display="flex" alignItems="flex-start" justifyContent="center" width="100%">
                <Stack direction="row" spacing={2} alignItems="flex-start" width="100%" >
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                        <ForumRoundedIcon />
                    </Avatar>
                    <Box
                        sx={{
                            width: "100%",
                            bgcolor: "action.hover",
                            borderRadius: 2,
                            p: 2,
                        }}
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            {MENSAJE_BIENVENIDA.titulo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {MENSAJE_BIENVENIDA.cuerpo}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
