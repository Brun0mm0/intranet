import { Box, Tooltip, Typography } from "@mui/material";
import { copyToClipboard, estaVigente, formatCuilTexto, formatDni } from "../../../utils/utils";
import EstadoChip from "../../../components/common/EstadoChip";
import { RowActionsMenu } from "./Rowactionsmenu";

// 🔹 Copy reutilizable: muestra el valor formateado y copia el valor crudo.
const renderCopyCell = (transformCopia, formatear = (v) => v) => (params) => {
  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!params.value) return;
    await copyToClipboard(transformCopia(params.value));
  };

  return (
    <Tooltip title="Click para copiar">
      <Box component="span" sx={{ cursor: "pointer" }} onClick={handleCopy}>
        {formatear(params.value) ?? "—"}
      </Box>
    </Tooltip>
  );
};

// 🔹 Estado de cobertura: etiqueta de color fuerte en lugar de pintar la fila.
export const getStatusColumn = () => ({
  field: "vigente",
  headerName: "Estado",
  width: 130,
  filterable: false,
  valueGetter: (value, row) => estaVigente(row.fecha_inicio_cober, row.fecha_fin_cober),
  renderCell: (params) => (
    <EstadoChip
      estado={params.value ? "vigente" : "baja"}
      label={params.value ? "Vigente" : "No vigente"}
    />
  ),
});

// 🔹 Apellido y nombre juntos; marca cuando la API trajo el mismo registro repetido.
export const getNombreColumn = () => ({
  field: "Apellido",
  headerName: "Apellido y nombre",
  flex: 1.8,
  minWidth: 220,
  valueGetter: (value, row) => [row.Apellido, row.Nombre].filter(Boolean).join(", "),
  renderCell: (params) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, height: "100%" }}>
      <Typography variant="body2" fontWeight={700} noWrap>
        {params.value}
      </Typography>
      {params.row._repetidos > 1 && (
        <Tooltip title={`La búsqueda devolvió ${params.row._repetidos} registros iguales; se muestra uno solo`}>
          <Box
            component="span"
            sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#46565d", bgcolor: "#eef1f3", borderRadius: 99, px: 1, flexShrink: 0 }}
          >
            ×{params.row._repetidos} registros
          </Box>
        </Tooltip>
      )}
    </Box>
  ),
});

// 🔹 Columnas de datos con copy-to-clipboard — siempre presentes.
export const getCopyColumns = () => [
  {
    field: "Nro_Afil",
    headerName: "Nº Afiliado",
    flex: 0.9,
    minWidth: 120,
    renderCell: renderCopyCell((v) => v.toString().slice(0, -2)),
  },
  {
    field: "Nro_Doc",
    headerName: "Documento",
    flex: 1,
    minWidth: 130,
    renderCell: (params) => {
      const tipo = params.row.Tipo_Doc ? `${params.row.Tipo_Doc} ` : "";
      return renderCopyCell((v) => v.toString(), (v) => (v ? `${tipo}${formatDni(v)}` : null))(params);
    },
  },
  {
    field: "CUIL",
    headerName: "CUIL",
    flex: 1,
    minWidth: 140,
    renderCell: renderCopyCell((v) => v.toString(), formatCuilTexto),
  },
];

// 🔹 Acciones frecuentes a la vista + menú con el resto, siempre al final de la fila.
export const getActionsColumn = ({ onPrintConsulta, onInfoClick, fetchAportes, onVerGrupoFamiliar }) => ({
  field: "acciones",
  headerName: "Acciones",
  width: 170,
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
