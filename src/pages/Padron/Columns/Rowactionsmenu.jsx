import { useState } from "react";
import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import { estaVigente } from "../../../utils/utils";

// 🔹 Menú de acciones por fila — reemplaza los botones sueltos (Ver/Aportes/Activo)
// que antes solo aparecían cuando `variant === "simple"` (un solo resultado).
// Ahora es una única columna, siempre presente, sin importar cuántas filas haya.
//
// ⚠️ Export nombrado (no default) — quien lo importe debe usar
// `import { RowActionsMenu } from "./RowActionsMenu"`, no un import default.
export function RowActionsMenu({ row, onInfoClick, fetchAportes, onPrintConsulta, onVerGrupoFamiliar }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // ✅ Aportes se condiciona a que exista Cuil_titular Y a que la
  // cobertura esté vigente.
  const esVigente = estaVigente(row.fecha_inicio_cober, row.fecha_fin_cober);

  const handleOpenMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  const items = [
    {
      key: "ver",
      label: "Ver",
      icon: <PersonSearchIcon fontSize="small" />,
      onClick: () => onInfoClick(row),
    },
    {
      key: "aportes",
      label: "Aportes",
      icon: <PriceCheckOutlinedIcon fontSize="small" />,
      // ✅ El CUIL no lleva ningún código pegado al final (a diferencia
      // de Nro_Afil) — se usa tal cual viene del backend, sin recortar.
      onClick: () => fetchAportes(row.Cuil_titular),
      disabled: !row.Cuil_titular || !esVigente,
      subtext: !esVigente ? "Cobertura no vigente" : null,
    },
    {
      key: "imprimir",
      label: "Imprimir",
      icon: <PrintOutlinedIcon fontSize="small" />,
      // ✅ Antes: onPrintConsulta() no recibía la fila y siempre imprimía
      // afiliadoArr[0] sin importar en qué fila se hacía click.
      onClick: () => onPrintConsulta(row),
    },
    {
      key: "grupoFamiliar",
      label: "Ver grupo familiar",
      icon: <GroupsIcon fontSize="small" />,
      // ✅ Se saca siempre el código de parentesco (últimos 2 dígitos) de
      // Nro_Afil ANTES de que PadronPage le vuelva a agregar "00" — si
      // no, queda un "00" duplicado (9 dígitos → 11).
      
      onClick: () => {console.log("Nro_Afil en RowActionsMenu:", String(row.Nro_Afil).slice(0, -2));onVerGrupoFamiliar(String(row.Nro_Afil).slice(0, -2))},
    },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <IconButton size="small" onClick={handleOpenMenu}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleCloseMenu}>
        {items.map(({ key, label, icon, onClick, disabled, subtext }) => (
          <MenuItem
            key={key}
            disabled={disabled}
            onClick={() => {
              handleCloseMenu();
              onClick();
            }}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>
              {label}
              {subtext && (
                <Typography component="span" variant="caption" sx={{ display: "block", color: "text.disabled" }}>
                  {subtext}
                </Typography>
              )}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}