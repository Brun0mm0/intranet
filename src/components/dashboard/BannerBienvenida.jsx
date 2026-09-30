import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../../auth";
import { useReloj } from "../../hooks/useReloj";
import { useClima } from "../../hooks/useClima";
import { CIUDADES } from "../../config/ciudades";
import PageHeader from "../common/PageHeader";

const TZ = "America/Argentina/Buenos_Aires";
const suave = { color: "rgba(255,255,255,0.92)" };

// Banner de bienvenida del inicio: saludo, hora y clima.
// Usa PageHeader para tener la misma altura que los encabezados del resto de las páginas.
export default function BannerBienvenida({ ciudad = "buenos-aires", sx }) {
    const { user } = useAuth();
    const ahora = useReloj();
    const config = CIUDADES[ciudad];
    const { clima, loading, error } = useClima(config ?? {});

    const hora = ahora.toLocaleTimeString("es-AR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    const fecha = ahora.toLocaleDateString("es-AR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });

    return (
        <PageHeader sx={sx}>
            <Box flex={1} minWidth={0}>
                <Typography variant="h5" fontWeight={700} color="inherit" noWrap lineHeight={1.25}>
                    Hola, {user?.usuario ?? "bienvenido"}
                </Typography>
                <Typography variant="body2" sx={suave} noWrap>
                    Bienvenido a la intranet de Servicios Sociales Bancarios
                </Typography>
            </Box>

            <Stack direction="row" alignItems="center" spacing={2.5} flexShrink={0}>
                <Box textAlign="right">
                    <Typography variant="h4" fontWeight={700} color="inherit" lineHeight={1.1} sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {hora}
                    </Typography>
                    <Typography variant="body2" textTransform="capitalize" sx={suave}>
                        {fecha}
                    </Typography>
                </Box>

                <Box sx={{ width: "1px", height: 44, bgcolor: "rgba(255,255,255,0.4)" }} />

                <Box textAlign="right" minWidth={110}>
                    {loading && <CircularProgress size={24} sx={{ color: "#fff" }} />}
                    {!loading && (error || !clima) && (
                        <Typography variant="body2" sx={suave}>Clima no disponible</Typography>
                    )}
                    {!loading && clima && (
                        <>
                            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.75}>
                                <Typography variant="h6" component="span" aria-hidden lineHeight={1.1}>{clima.icon}</Typography>
                                <Typography variant="h5" fontWeight={700} color="inherit" lineHeight={1.1}>
                                    {Math.round(clima.temperatura)}°C
                                </Typography>
                            </Stack>
                            <Typography variant="body2" sx={suave} noWrap>
                                {config?.label} · {clima.desc}
                            </Typography>
                        </>
                    )}
                </Box>
            </Stack>
        </PageHeader>
    );
}
