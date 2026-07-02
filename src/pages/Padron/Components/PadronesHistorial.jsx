import { Stack, TextField, Typography } from "@mui/material";

export const PadronesHistorial = ({ historial = [] }) => {

  if (!Array.isArray(historial) || historial.length === 0) {
    return <Typography>Historial vacío</Typography>;
  }

  const isExpired = (fechaFin) => {
    if (!fechaFin) return false;
    const parsedDate = new Date(fechaFin.split("/").reverse().join("-"));
    return !isNaN(parsedDate) && parsedDate < new Date();
  };

  return (
    <Stack direction="row" spacing={3}>
      {historial.map((item, index) => {
        const expired = isExpired(item.fecha_fin_cober);
        const dataMap = {
          plan_cober: item.plan_cober,
          motivo_baja: item.motivo_baja || "—",
          tipo_cobertura: item.tipo_cobertura || "—",
          fecha_inicio_cober: item.fecha_inicio_cober,
          fecha_fin_cober: item.fecha_fin_cober || null,
        };
        return (
          <Stack
            key={index}
            spacing={2}
            p={2}
            bgcolor={
              expired ? "#e4e4e4ff" : "#bddab1ff"
            }
            borderRadius={2}
          >
            <Typography>{expired ? "No vigente" : "Vigente"}</Typography>
            {Object.entries(dataMap).map(([key, value]) => (
              <TextField
                key={key}
                label={key.replace(/_/g, " ")}
                defaultValue={value ?? "—"}
                fullWidth
                variant="standard"
                // disabled={expired}
              />
            ))}
          </Stack>
        );
      })}
    </Stack>
  );
};
