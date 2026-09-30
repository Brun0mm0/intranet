import { useReloj } from "../../hooks/useReloj";
import { Typography } from "@mui/material";

export default function RelojWidget() {
  const ahora = useReloj();

  const hora = ahora.toLocaleTimeString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const fecha = ahora.toLocaleDateString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <Typography variant="h3">{hora}</Typography>
      <Typography variant="body1" color="text.secondary" textTransform="capitalize">
        {fecha}
      </Typography>
    </>
  );
}