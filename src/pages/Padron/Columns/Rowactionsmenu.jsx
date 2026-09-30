import { useState } from "react";
import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import { estaVigente } from "../../../utils/utils";

const iconButtonSx = {
  border: 1,
  borderColor: "#d3dfe4",
  borderRadius: 1.5,
  color: "#0079a0",
  "&:hover": { bgcolor: "#e6f6fb", borderColor: "#9cc9da" },
  "&.Mui-disabled": { color: "#b8c4c9", borderColor: "#e6ecef" },
};

// 🔹 Acciones por fila: Ver, Aportes e Imprimir a la vista; "Ver grupo familiar" en el menú.
//
// ⚠️ Export nombrado (no default) — importar con `import { RowActionsMenu } from "./Rowactionsmenu"`.
export function RowActionsMenu({ row, onInfoClick, fetchAportes, onPrintConsulta, onVerGrupoFamiliar }) {
  const [anchorEl, setAnchorEl] = useState(null);

  // ✅ Aportes se condiciona a que exista Cuil_titular Y a que la cobertura esté vigente.
  const esVigente = estaVigente(row.fecha_inicio_cober, row.fecha_fin_cober);
  const aportesDisabled = !row.Cuil_titular || !esVigente;

  // Evita que el click en una acción dispare también el click de la fila (que abre el detalle).
  const accion = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, height: "100%" }}>
      <Tooltip title="Ver detalle">
        <IconButton size="small" sx={iconButtonSx} onClick={accion(() => onInfoClick(row))}>
          <PersonSearchIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title={!esVigente ? "Cobertura no vigente" : !row.Cuil_titular ? "Sin CUIL de titular" : "Aportes"}>
        <span>
          <IconButton
            size="small"
            sx={iconButtonSx}
            disabled={aportesDisabled}
            onClick={accion(() => fetchAportes(row))}
          >
            <PriceCheckOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Imprimir">
        <IconButton size="small" sx={iconButtonSx} onClick={accion(() => onPrintConsulta(row))}>
          <PrintOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Más acciones">
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} onClick={(e) => e.stopPropagation()}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            // ✅ Se saca el código de parentesco (últimos 2 dígitos) de Nro_Afil
            // ANTES de que PadronPage le vuelva a agregar "00".
            onVerGrupoFamiliar(String(row.Nro_Afil).slice(0, -2));
          }}
        >
          <ListItemIcon><GroupsIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Ver grupo familiar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
