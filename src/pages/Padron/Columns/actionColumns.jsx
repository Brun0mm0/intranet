import { Box, Tooltip } from "@mui/material";
import { copyToClipboard, estaVigente } from "../../../utils/utils";
import { RowActionsMenu } from "./RowActionsMenu";

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
// El componente interactivo (RowActionsMenu) vive en su propio archivo;
// acá solo se arma la definición de columna para el DataGrid.
export const getActionsColumn = ({ onPrintConsulta, onInfoClick, fetchAportes, onVerGrupoFamiliar }) => ({
  field: "acciones",
  headerName: "Acciones",
  width: 80,
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