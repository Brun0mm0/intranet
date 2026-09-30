import { Box, Stack, Typography } from "@mui/material";
import EstadoChip from "../../../components/common/EstadoChip";
import { parseDotDate, parseIsoDate, formatDate, formatDateTime, formatCurrency } from "../../../utils/formatters";

// 🔹 Tipos de comprobante: etiqueta de color en lugar de pintar la fila entera
export const TIPOS_COMPROBANTE = {
  FAC: { label: "Factura", plural: "Facturas", estado: "info" },
  OP: { label: "Orden de pago", plural: "Órdenes de pago", estado: "pendiente" },
  NC: { label: "Nota de crédito", plural: "Notas de crédito", estado: "neutral" },
};

export const DIAS_VENCE_PRONTO = 15;

// El backend manda 01.01.1800 cuando la factura no tiene vencimiento
export const parseVencimiento = (valor) => {
  const fecha = parseDotDate(valor);
  return fecha && fecha.getFullYear() > 1900 ? fecha : null;
};

const hoy = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const vencePronto = (fecha) => {
  if (!fecha) return false;
  const dias = (fecha - hoy()) / 86400000;
  return dias >= 0 && dias <= DIAS_VENCE_PRONTO;
};

const esNotaCredito = (row) => row.CTE_TIPO?.toUpperCase() === "NC";

// Las notas de crédito restan: se muestran en rojo con signo menos
const renderImporte = (negrita) => (params) => {
  if (params.value == null || params.value === "") return "";
  const nc = esNotaCredito(params.row);
  return (
    <Box component="span" sx={{ fontWeight: negrita ? 700 : 400, color: nc ? "#b3322a" : "inherit" }}>
      {nc ? "−" : ""}{formatCurrency(params.value)}
    </Box>
  );
};

const proveedorColumns = [
  {
    field: "PRV_RAZON_SOCIAL",
    headerName: "Proveedor",
    flex: 1.3,
    minWidth: 200,
    renderCell: (params) => (
      <Typography variant="body2" fontWeight={700} noWrap>{params.value}</Typography>
    ),
  },
  { field: "PRV_CUIT", headerName: "CUIT", width: 135 },
];

const baseFacturasColumns = [
  {
    field: "CTE_TIPO",
    headerName: "Tipo",
    width: 150,
    valueGetter: (value) => TIPOS_COMPROBANTE[value?.toUpperCase()]?.label ?? value?.toUpperCase() ?? "",
    renderCell: (params) => {
      const tipo = TIPOS_COMPROBANTE[params.row.CTE_TIPO?.toUpperCase()];
      return <EstadoChip estado={tipo?.estado ?? "neutral"} label={params.value} />;
    },
  },
  {
    field: "comprobante",
    headerName: "Comprobante",
    width: 175,
    // Letra junto al número: "B 00004-00001138"
    valueGetter: (_, row) => `${row.CTE_LETRA?.toUpperCase() ?? ""} ${row.CTE_PRENUMERO ?? ""}-${row.CTE_NUMERO ?? ""}`.trim(),
    renderCell: (params) => <Typography variant="body2" fontWeight={700}>{params.value}</Typography>,
  },
  {
    field: "CTE_CONCEPTO",
    headerName: "Descripción",
    flex: 1,
    minWidth: 180,
  },
  {
    field: "LIN_IMPORTE_BASE",
    headerName: "Importe base",
    width: 150,
    type: "number",
    renderCell: renderImporte(false),
  },
  {
    field: "CTE_IMPORTE_TOTAL",
    headerName: "Importe total",
    width: 150,
    type: "number",
    renderCell: renderImporte(true),
  },
  {
    field: "FECHA_REGISTRO",
    headerName: "Registro en Tango",
    width: 150,
    valueGetter: (_, row) => parseIsoDate(row.FECHA_REGISTRO),
    valueFormatter: (value) => formatDateTime(value),
  },
  {
    field: "fechaVencimiento",
    headerName: "Vencimiento",
    width: 190,
    valueGetter: (_, row) => parseVencimiento(row.CTE_FECHA_VTO),
    renderCell: (params) =>
      params.value ? (
        <Stack direction="row" alignItems="center" spacing={1} height="100%">
          <span>{formatDate(params.value)}</span>
          {vencePronto(params.value) && <EstadoChip estado="baja" label="Vence pronto" />}
        </Stack>
      ) : (
        <Box component="span" sx={{ color: "#8a979d" }}>Sin vencimiento</Box>
      ),
  },
];

export const getFacturasColumns = (searchParam) => {
  if (searchParam === "numero_factura") {
    return [...proveedorColumns, ...baseFacturasColumns];
  }
  return baseFacturasColumns;
};
