import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, ButtonBase, Stack, Typography } from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { useDispatch } from "react-redux";
import { SearchInput } from "../../../components/inputs/SearchInput";
import { MARINO } from "../../../shared-theme/customizations/dataGrid";
import { fetchConsultaFacturas } from "../../../store/prestaciones/thunks";
import { detectarBusquedaFacturas, ETIQUETAS, TIPOS } from "../utils/detectarBusquedaFacturas";

const BANNER_BG = "linear-gradient(110deg, #0092c0 0%, #00a9da 45%, #02b57e 100%)";
const DEBOUNCE_MS = 500;

const PLACEHOLDER = {
  cuit: "CUIT, con o sin guiones",
  razon_social: "Razón social del proveedor",
  numero_factura: "Número de factura, ej. 00004-00001138",
};

// 🔹 Buscador de Control de Facturas con el mismo estilo que el Padrón.
// Las pastillas muestran el tipo detectado y se puede hacer clic para forzar otro.
// CUIT y razón social buscan solos; el N° de factura, con el botón o Enter.
export const PrestacionesBar = ({ loading, errorText = null, onSearchParamChange }) => {
  const dispatch = useDispatch();
  const [texto, setTexto] = useState("");
  const [tipoForzado, setTipoForzado] = useState(null);
  const ultimaBusquedaRef = useRef(null);

  const deteccion = useMemo(() => detectarBusquedaFacturas(texto, tipoForzado), [texto, tipoForzado]);

  const buscar = (param, value, forzar = false) => {
    const clave = `${param}:${value}`;
    if (!forzar && clave === ultimaBusquedaRef.current) return;
    ultimaBusquedaRef.current = clave;
    onSearchParamChange(param);
    dispatch(fetchConsultaFacturas({ param, value }));
  };

  // Búsqueda automática para CUIT completo y razón social
  useEffect(() => {
    if (!deteccion.auto) return;
    const id = setTimeout(() => buscar(deteccion.param, deteccion.value), DEBOUNCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deteccion.auto, deteccion.param, deteccion.value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deteccion.listo) return;
    // Número corto sin tipo claro: se busca como N° de factura
    buscar(deteccion.param ?? "numero_factura", deteccion.value, true);
  };

  const elegirTipo = (tipo) => setTipoForzado((actual) => (actual === tipo ? null : tipo));
  const mensaje = errorText ?? deteccion.mensaje;

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
        <ReceiptLongRoundedIcon />
        <Typography variant="h6" fontWeight={700} color="inherit" noWrap>
          Buscar facturas
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
          placeholder={tipoForzado ? PLACEHOLDER[tipoForzado] : "CUIT, razón social o N° de factura"}
          autoFocus
          sx={{ width: "100%", bgcolor: "#fff", borderRadius: 2, pr: 0 }}
          inputProps={{ "aria-describedby": "facturas-busqueda-ayuda" }}
        />
        {mensaje && (
          <Typography
            id="facturas-busqueda-ayuda"
            variant="caption"
            sx={{ position: "absolute", left: 4, top: "100%", mt: 0.25, color: "#fff", fontWeight: 600, whiteSpace: "nowrap", lineHeight: 1.3 }}
          >
            {mensaje}
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
};
