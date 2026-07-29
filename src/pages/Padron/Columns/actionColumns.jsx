import GroupsIcon from "@mui/icons-material/Groups";
import { useState } from "react";
import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Popover, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import HistoryIcon from "@mui/icons-material/History";
import { copyToClipboard, estaVigente } from "../../../utils/utils";
import { PadronesHistorial } from "../Components/PadronesHistorial";

// 🔹 Copy reutilizable (sin cambios de comportamiento)
const renderCopyCell = (transform) => (params) => {
  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!params.value) return;
    await copyToClipboard(transform(params.value));
  };

  return (
    <Tooltip title="Click para copiar">
      <Box
        sx={{ cursor: "pointer", width: "100%", textAlign: "center" }}
        onClick={handleCopy}
      >
        {params.value ?? "-"}
      </Box>
    </Tooltip>
  );
};

// 🔹 Menú de acciones por fila — reemplaza los botones sueltos (Ver/Aportes/Activo)
// que antes solo aparecían cuando `variant === "simple"` (un solo resultado).
// Ahora es una única columna, siempre presente, sin importar cuántas filas haya.
function RowActionsMenu({ row, onInfoClick, fetchAportes, onPrintConsulta, onVerGrupoFamiliar }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [historialAnchor, setHistorialAnchor] = useState(null);

  const menuOpen = Boolean(anchorEl);
  const historialOpen = Boolean(historialAnchor);

  const handleOpenMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  const handleVer = () => {
    handleCloseMenu();
    onInfoClick(row);
  };

  const handleAportes = () => {
    handleCloseMenu();
    // ✅ Se saca siempre el código de parentesco (últimos 2 dígitos) de
    // Cuil_titular antes de buscar aportes.
    const cuil = String(row.Cuil_titular);
    fetchAportes(row.Cuil_titular ? row.Cuil_titular : row.CUIL);
  };

  const handleImprimir = () => {
    handleCloseMenu();
    // ✅ Antes: onPrintConsulta() no recibía la fila y siempre imprimía
    // afiliadoArr[0] sin importar en qué fila se hacía click.
    onPrintConsulta(row);
  };

  const handleVerGrupoFamiliar = () => {
    handleCloseMenu();
    // ✅ Se saca siempre el código de parentesco (últimos 2 dígitos) de
    // Nro_Afil ANTES de que PadronPage le vuelva a agregar "00" — si no,
    // queda un "00" duplicado (9 dígitos → 11).
    const nroAfil = String(row.Nro_Afil).slice(0, -2);
    onVerGrupoFamiliar(nroAfil);
  };

  const handleVerHistorial = (e) => {
    const anchor = anchorEl;
    handleCloseMenu();
    setHistorialAnchor(anchor);
  };

  const handleCloseHistorial = () => setHistorialAnchor(null);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <IconButton size="small" onClick={handleOpenMenu}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleCloseMenu}>
        <MenuItem onClick={handleVer}>
          <ListItemIcon><PersonSearchIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Ver</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleVerHistorial} disabled={!row.historial_coberturas?.length}>
          <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Ver historial</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAportes}>
          <ListItemIcon><PriceCheckOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Aportes</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleImprimir}>
          <ListItemIcon><PrintOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Imprimir</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleVerGrupoFamiliar}>
          <ListItemIcon><GroupsIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Ver grupo familiar</ListItemText>
        </MenuItem>
      </Menu>

      <Popover
        open={historialOpen}
        anchorEl={historialAnchor}
        onClose={handleCloseHistorial}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box p={2}>
          <PadronesHistorial historial={row.historial_coberturas || []} />
        </Box>
      </Popover>
    </Box>
  );
}

// 🔹 Columna de estado (antes mezclada con la acción "ver historial" y
// condicionada por variant). Ahora es solo un indicador de vigencia,
// siempre presente, sin importar la cantidad de resultados.
export const getStatusColumn = () => ({
  field: "vigente",
  headerName: "Vigente",
  width: 80,
  sortable: false,
  filterable: false,
  renderCell: (params) => {
    const esActivo = estaVigente(
      params.row.fecha_inicio_cober,
      params.row.fecha_fin_cober
    );
    return (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", height: "100%", alignItems: "center" }}>
        <Tooltip title={esActivo ? "Vigente" : "No vigente"}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: esActivo ? "success.main" : "error.main",
            }}
          />
        </Tooltip>
      </Box>
    );
  },
});

// 🔹 Columnas de datos con copy-to-clipboard — siempre presentes.
export const getCopyColumns = () => [
  {
    field: "Nro_Afil",
    headerName: "Nº Afiliado",
    width: 100,
    renderCell: renderCopyCell((v) => v.toString().slice(0, -2)),
  },
  {
    field: "Nro_Doc",
    headerName: "Nº Documento",
    width: 110,
    renderCell: renderCopyCell((v) => v.toString()),
  },
  {
    field: "CUIL",
    headerName: "Nº Cuil",
    width: 110,
    renderCell: renderCopyCell((v) => v.toString()),
  },
];

// 🔹 Columna de Acciones — un solo desplegable, siempre al final de la fila.
// Antes: variant "simple"/"full" decidía si aparecían activo/ver/aportes,
// lo que hacía que la lista se viera distinta según la cantidad de resultados.
export const getActionsColumn = ({ onPrintConsulta, onInfoClick, fetchAportes, onVerGrupoFamiliar }) => ({
  field: "acciones",
  headerName: "Acciones",
  width: 70,
  sortable: false,
  filterable: false,
  renderCell: (params) => (
    <RowActionsMenu
      row={params.row}
      onInfoClick={onInfoClick}
      fetchAportes={fetchAportes}
      onPrintConsulta={onPrintConsulta}
      onVerGrupoFamiliar={onVerGrupoFamiliar}
    />
  ),
});