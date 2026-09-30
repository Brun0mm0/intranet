import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../../auth";
import { useReloj } from "../../hooks/useReloj";
import { useClima } from "../../hooks/useClima";
import { CIUDADES } from "../../config/ciudades";

const TZ = "America/Argentina/Buenos_Aires";

// Único bloque con color de marca en el inicio: saludo, hora y clima.
export default function BannerBienvenida({ ciudad = "buenos-aires", sx }) {
    const { user } = useAuth();
    const ahora = useReloj();
    const config = CIUDADES[ciudad];
    const { clima, loading, error } = useClima(config ?? {});

    const hora = ahora.toLocaleTimeString("es-AR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    const fecha = ahora.toLocaleDateString("es-AR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });

    return (
        <Box
            sx={{
                borderRadius: 3,
                px: 3,
                py: 2.5,
                color: "#fff",
                backgroundImage: "linear-gradient(110deg, #0092c0 0%, #00a9da 45%, #02b57e 100%)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                ...sx,
            }}
        >
            <Box minWidth={0}>
                <Typography variant="h4" fontWeight={700} color="inherit">
                    Hola, {user?.usuario ?? "bienvenido"}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Bienvenido a la intranet de Servicios Sociales Bancarios
                </Typography>
            </Box>

            <Stack direction="row" alignItems="center" spacing={3}>
                <Box textAlign="right">
                    <Typography variant="h3" fontWeight={700} color="inherit" lineHeight={1} sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {hora}
                    </Typography>
                    <Typography variant="body2" textTransform="capitalize" sx={{ opacity: 0.9 }}>
                        {fecha}
                    </Typography>
                </Box>

                <Box sx={{ width: "1px", alignSelf: "stretch", bgcolor: "rgba(255,255,255,0.4)" }} />

                <Box textAlign="right" minWidth={110}>
                    {loading && <CircularProgress size={24} sx={{ color: "#fff" }} />}
                    {!loading && (error || !clima) && (
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Clima no disponible</Typography>
                    )}
                    {!loading && clima && (
                        <>
                            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                                <Typography variant="h5" component="span" aria-hidden>{clima.icon}</Typography>
                                <Typography variant="h4" fontWeight={700} color="inherit" lineHeight={1}>
                                    {Math.round(clima.temperatura)}°C
                                </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {config?.label} · {clima.desc}
                            </Typography>
                        </>
                    )}
                </Box>
            </Stack>
        </Box>
    );
}
