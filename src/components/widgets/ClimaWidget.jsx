import { Typography, Stack, CircularProgress } from "@mui/material";
import { useClima } from "../../hooks/useClima";
import { CIUDADES } from "../../config/ciudades";

export default function ClimaWidget({ ciudad = "buenos-aires" }) {
  const config = CIUDADES[ciudad];
  const { clima, loading, error } = useClima(config ?? {});

  if (!config) {
    return <Typography color="error">Ciudad "{ciudad}" no configurada</Typography>;
  }
  if (loading) return <CircularProgress size={20} />;
  if (error) return <Typography color="text.secondary">No se pudo obtener el clima</Typography>;

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
        <Typography variant="h5">{clima.icon}</Typography>
        <Typography variant="h4">{Math.round(clima.temperatura)}°C</Typography>
      </Stack>
      <Stack direction="column" spacing={0} alignItems="center" justifyContent="center">
        <Typography variant="body2" color="text.secondary">
          {clima.desc}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {config.label}
        </Typography>
      </Stack>
    </Stack>
  );
}