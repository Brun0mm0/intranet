import { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { SearchInput } from "../../../components/inputs/SearchInput";
import { getFacturasColumns, parseVencimiento, TIPOS_COMPROBANTE } from "../columns/facturasColumns";
import { formatCurrency } from "../../../utils/formatters";
import { panelSx } from "../../../shared-theme/customizations/intranetStyles";
import { dataGridLocaleText, dataGridSx, MARINO } from "../../../shared-theme/customizations/dataGrid";

const tipoDe = (row) => row.CTE_TIPO?.toUpperCase() ?? "";

function Kpi({ label, value, color, destacado }) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: destacado ? "#f0d58a" : "#e1e8eb",
        bgcolor: destacado ? "#fffaeb" : "background.paper",
        borderRadius: 2,
        px: 1.5,
        py: 0.75,
        minWidth: 130,
      }}
    >
      <Typography variant="caption" sx={{ color: "#46565d", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </Typography>
      <Typography variant="subtitle1" fontWeight={700} sx={{ color: color ?? "text.primary", fontVariantNumeric: "tabular-nums", lineHeight: 1.3 }}>
        {value}
      </Typography>
    </Box>
  );
}

// 🔹 Proveedor destacado con totales (búsqueda por CUIT o razón social)
function ProveedorCard({ proveedor, rows, onDescargar }) {
  const resumen = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const sumar = (tipo) => rows.filter((r) => tipoDe(r) === tipo).reduce((acc, r) => acc + (Number(r.CTE_IMPORTE_TOTAL) || 0), 0);
    const vencenEsteMes = rows.filter((r) => {
      const vto = parseVencimiento(r.CTE_FECHA_VTO);
      return vto && vto >= hoy && vto.getMonth() === hoy.getMonth() && vto.getFullYear() === hoy.getFullYear();
    }).length;
    return { facturado: sumar("FAC"), notasCredito: sumar("NC"), vencenEsteMes };
  }, [rows]);

  return (
    <Box sx={{ ...panelSx, px: 2.5, py: 1.75, display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
      <Box minWidth={0}>
        <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
          {proveedor.razon_social}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
          CUIT {proveedor.cuit}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.25} sx={{ ml: "auto", flexWrap: "wrap" }} useFlexGap>
        <Kpi label="Comprobantes" value={rows.length} />
        <Kpi label="Facturado" value={formatCurrency(resumen.facturado)} />
        <Kpi label="Notas de crédito" value={resumen.notasCredito ? `−${formatCurrency(resumen.notasCredito)}` : formatCurrency(0)} color={resumen.notasCredito ? "#b3322a" : undefined} />
        <Kpi label="Vencen este mes" value={resumen.vencenEsteMes} destacado={resumen.vencenEsteMes > 0} />
      </Stack>

      <Button variant="outlined" startIcon={<DownloadIcon />} onClick={onDescargar}>
        Excel
      </Button>
    </Box>
  );
}

export const PrestacionesTabla = ({ loading, rows, proveedor, searchParam }) => {
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [textoFiltro, setTextoFiltro] = useState("");

  // Cada búsqueda nueva vuelve a mostrar todo
  useEffect(() => {
    setTipoFiltro("todos");
    setTextoFiltro("");
  }, [rows]);

  const columns = getFacturasColumns(searchParam);
  const rowsConId = useMemo(() => rows.map((row, index) => ({ id: row.ID ?? index, ...row })), [rows]);

  const porFactura = searchParam === "numero_factura";
  const showProveedorHeader = !porFactura && Boolean(proveedor?.razon_social) && rowsConId.length > 0;

  // Filtros por tipo: solo los tipos que aparecen en los resultados
  const conteoTipos = useMemo(() => {
    const conteo = {};
    rowsConId.forEach((r) => {
      const t = tipoDe(r);
      conteo[t] = (conteo[t] ?? 0) + 1;
    });
    return conteo;
  }, [rowsConId]);

  const filteredRows = useMemo(() => {
    const texto = textoFiltro.trim().toLowerCase();
    return rowsConId.filter((row) => {
      if (tipoFiltro !== "todos" && tipoDe(row) !== tipoFiltro) return false;
      if (!texto) return true;
      // ✅ Antes el texto decía "CUIT o Razón Social" aunque filtraba por número de factura
      if (porFactura) {
        return row.PRV_CUIT?.toLowerCase().includes(texto) || row.PRV_RAZON_SOCIAL?.toLowerCase().includes(texto);
      }
      const comprobante = `${row.CTE_PRENUMERO ?? ""}${row.CTE_NUMERO ?? ""}`;
      const comprobanteConGuion = `${row.CTE_PRENUMERO ?? ""}-${row.CTE_NUMERO ?? ""}`;
      return comprobante.includes(texto.replace(/\D/g, "") || texto) || comprobanteConGuion.includes(texto);
    });
  }, [rowsConId, tipoFiltro, textoFiltro, porFactura]);

  const handleDownloadExcel = () => {
    if (!rowsConId.length) return;
    const dataToExport = rowsConId.map(({ id, ...row }) => row); // eslint-disable-line no-unused-vars
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prestaciones");
    XLSX.writeFile(workbook, `${proveedor.cuit} - ${proveedor.razon_social}.xlsx`);
  };

  const filtros = [
    { value: "todos", label: "Todos", cantidad: rowsConId.length },
    ...Object.keys(TIPOS_COMPROBANTE)
      .filter((t) => conteoTipos[t])
      .map((t) => ({ value: t, label: TIPOS_COMPROBANTE[t].plural, cantidad: conteoTipos[t] })),
  ];

  const sinFilas = !loading && filteredRows.length === 0;

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
      {showProveedorHeader && <ProveedorCard proveedor={proveedor} rows={rowsConId} onDescargar={handleDownloadExcel} />}

      <Box sx={{ ...panelSx, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {rowsConId.length > 0 && (
          <Stack direction="row" alignItems="center" spacing={1} px={2} py={1.25} borderBottom={1} borderColor="#e1e8eb" flexWrap="wrap" useFlexGap>
            {filtros.map((f) => {
              const activo = tipoFiltro === f.value;
              return (
                <Chip
                  key={f.value}
                  label={`${f.label} ${f.cantidad}`}
                  onClick={() => setTipoFiltro(f.value)}
                  variant={activo ? "filled" : "outlined"}
                  sx={{ fontWeight: 700, ...(activo && { bgcolor: MARINO, "& .MuiChip-label": { color: "#fff" }, "&:hover": { bgcolor: MARINO } }) }}
                />
              );
            })}
            <Box sx={{ ml: "auto", width: 280 }}>
              <SearchInput
                name="filtro"
                size="small"
                value={textoFiltro}
                onChange={(e) => setTextoFiltro(e.target.value)}
                placeholder={porFactura ? "Filtrar por CUIT o razón social" : "Filtrar por N° de comprobante"}
                sx={{ width: "100%", pr: 0 }}
              />
            </Box>
          </Stack>
        )}

        {/* Sin filas: solo el mensaje, sin encabezado de columnas ni paginador */}
        {sinFilas ? (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={4}>
            <Typography color="text.secondary" textAlign="center">
              {rowsConId.length === 0
                ? "Sin resultados. Buscá facturas por CUIT, razón social o número con la barra de arriba."
                : "Ningún comprobante coincide con el filtro."}
            </Typography>
          </Box>
        ) : (
          <DataGrid
            localeText={dataGridLocaleText}
            loading={loading}
            density="compact"
            disableRowSelectionOnClick
            rows={filteredRows}
            columns={columns}
            sx={{ ...dataGridSx, flex: 1, minHeight: 0, width: "100%" }}
          />
        )}
      </Box>
    </Stack>
  );
};
