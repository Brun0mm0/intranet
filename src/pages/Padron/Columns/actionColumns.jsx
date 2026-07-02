import { Box, IconButton, Tooltip } from "@mui/material";
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import { copyToClipboard, estaVigente } from '../../../utils/utils';

// 🔹 Copy reutilizable
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

// 🔹 Factory
export const getActionColumns = ({
  onPrintConsulta,
  handleClick,
  onInfoClick,
  fetchAportes,
  variant // "simple" | "full"
}) => {

  const columns = [];

  // ✅ Activo (solo en filtradas)
  if (variant === "simple") {
    columns.push({
      field: "activo",
      headerName: "Activo",
      width: 60,
      renderCell: (params) => {
        const esActivo = estaVigente(
          params.row.fecha_inicio_cober,
          params.row.fecha_fin_cober
        );

        return (
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Tooltip title="Ver historial">
              <IconButton onClick={(e) => handleClick(e, params.row)}>
                {esActivo
                  ? <CheckCircleIcon style={{ color: "green" }} />
                  : <CancelIcon style={{ color: "red" }} />}
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    });
  }

  // ✅ Imprimir (ambos)
  columns.push({
    field: "imprimir",
    headerName: "Imprimir",
    width: 60,
    renderCell: () => (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Tooltip title="Imprimir">
          <IconButton onClick={onPrintConsulta}>
            <PrintOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  // ✅ Copy fields
  columns.push(
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
    }
  );

  // ✅ Acciones extra (solo filtradas)
  if (variant === "simple") {
    columns.push(
      {
        field: "ver",
        headerName: "Ver",
        width: 60,
        renderCell: (params) => (
          <IconButton onClick={() => onInfoClick(params.row)}>
            <PersonSearchIcon />
          </IconButton>
        ),
      },
      {
        field: "aportes",
        headerName: "Aportes",
        width: 60,
        renderCell: (params) => (
          <IconButton onClick={() => fetchAportes(params.row.Cuil_titular)}>
            <PriceCheckOutlinedIcon />
          </IconButton>
        ),
      }
    );
  }

  return columns;
};