import { useMemo, useState } from "react";
import { Box, Button, ButtonBase, Stack, Typography } from "@mui/material";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { SearchInput } from "../../../components/inputs/SearchInput";
import { MARINO } from "../../../shared-theme/customizations/dataGrid";
import { useBusquedaAutomatica } from "../hooks/Usebusquedaautomatica";
import { detectarBusqueda, ETIQUETAS, TIPOS } from "../utils/detectarBusqueda";

const BANNER_BG = "linear-gradient(110deg, #0092c0 0%, #00a9da 45%, #02b57e 100%)";

const PLACEHOLDER = {
  dni: "Número de DNI",
  cuil: "CUIL, con o sin guiones",
  Nro_Afil: "Número de afiliado",
  apellido: "Apellido (y nombre)",
  nombre: "Nombre",
};

// 🔹 Buscador del Padrón con el degradado del banner.
// Las pastillas muestran el tipo que se detecta mientras se escribe (CUIL, DNI,
// N° de afiliado, apellido o "apellido nombre") y se puede hacer clic para forzar otro.
// Busca solo cuando el dato está completo; el botón y Enter buscan en el momento.
export default function PadronesBar({ loading }) {
  const [texto, setTexto] = useState("");
  const [tipoForzado, setTipoForzado] = useState(null);

  const deteccion = useMemo(() => detectarBusqueda(texto, tipoForzado), [texto, tipoForzado]);

  const { buscarAhora } = useBusquedaAutomatica(deteccion);

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarAhora();
  };

  // Clic en la pastilla activa elegida a mano: vuelve a la detección automática
  const elegirTipo = (tipo) => setTipoForzado((actual) => (actual === tipo ? null : tipo));

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundImage: BANNER_BG,
        borderRadius: 3,
        px: 2.5,
        pt: 1.5,
        pb: 2.5, // lugar fijo para el mensaje de ayuda debajo del campo
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 2.5,
        flexWrap: "wrap",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
        <GroupsRoundedIcon />
        <Typography variant="h6" fontWeight={700} color="inherit" noWrap>
          Buscar afiliado
        </Typography>
      </Stack>

      <Stack
        direction="row"
        role="radiogroup"
        aria-label="Buscar por"
        sx={{ bgcolor: "rgba(255,255,255,0.18)", borderRadius: 99, p: 0.5, gap: 0.25, flexShrink: 0 }}
      >
        {TIPOS.map((tipo) => {
          const activo = deteccion.param === tipo;
          return (
            <ButtonBase
              key={tipo}
              role="radio"
              aria-checked={activo}
              onClick={() => elegirTipo(tipo)}
              title={tipoForzado === tipo ? "Clic para volver a la detección automática" : undefined}
              sx={{
                px: 1.75,
                py: 0.75,
                borderRadius: 99,
                fontWeight: 700,
                fontSize: "0.9rem",
                color: activo ? "#0079a0" : "#fff",
                bgcolor: activo ? "#fff" : "transparent",
                transition: "background-color 120ms",
                "&:hover": { bgcolor: activo ? "#fff" : "rgba(255,255,255,0.2)" },
                "&.Mui-focusVisible": { outline: "2px solid #fff", outlineOffset: 2 },
              }}
            >
              {ETIQUETAS[tipo]}
            </ButtonBase>
          );
        })}
      </Stack>

      <Box flex={1} minWidth={260} position="relative">
        <SearchInput
          name="busqueda"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={tipoForzado ? PLACEHOLDER[tipoForzado] : "DNI, CUIL, N° de afiliado o apellido y nombre"}
          autoFocus
          sx={{ width: "100%", bgcolor: "#fff", borderRadius: 2, pr: 0 }}
          inputProps={{ "aria-describedby": "padron-busqueda-ayuda" }}
        />
        {deteccion.mensaje && (
          <Typography
            id="padron-busqueda-ayuda"
            variant="caption"
            sx={{ position: "absolute", left: 4, top: "100%", mt: 0.25, color: "#fff", fontWeight: 600, whiteSpace: "nowrap", lineHeight: 1.3 }}
          >
            {deteccion.mensaje}
          </Typography>
        )}
      </Box>

      <Button
        type="submit"
        size="large"
        loading={loading}
        disabled={!deteccion.listo}
        sx={{
          bgcolor: MARINO,
          color: "#fff",
          fontWeight: 700,
          px: 3.5,
          border: 0,
          "&:hover": { bgcolor: "#082c3b" },
          "&.Mui-disabled": { bgcolor: "rgba(11,59,79,0.45)", color: "rgba(255,255,255,0.75)" },
        }}
      >
        Buscar
      </Button>
    </Box>
  );
}
