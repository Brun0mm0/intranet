import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getColumns } from "../Columns";
import { estaVigente } from "../../../utils/utils";
import { panelSx } from "../../../shared-theme/customizations/intranetStyles";
import { dataGridLocaleText, dataGridSx, MARINO } from "../../../shared-theme/customizations/dataGrid";

const FILTROS = [
  { value: "todos", label: "Todos" },
  { value: "vigentes", label: "Vigentes" },
  { value: "baja", label: "No vigentes" },
];

// Clave de lo que se ve en la fila: si dos registros coinciden en todo esto, para el usuario son el mismo.
const claveVisible = (row, vigente) =>
  [row.Apellido, row.Nombre, row.Parentesco_cod, row.Plan, row.Sexo, row.Nro_Afil, row.Tipo_Doc, row.Nro_Doc, row.CUIL, vigente].join("|");

// ✅ La API a veces devuelve el mismo afiliado varias veces con los mismos datos visibles.
// Se muestra uno solo y se marca cuántos había (_repetidos).
const agruparRepetidos = (rows) => {
  const porClave = new Map();
  rows.forEach((row, index) => {
    const vigente = estaVigente(row.fecha_inicio_cober, row.fecha_fin_cober);
    const clave = claveVisible(row, vigente);
    const existente = porClave.get(clave);
    if (existente) {
      existente._repetidos += 1;
    } else {
      porClave.set(clave, { ...row, id: row.id ?? index, _vigente: vigente, _repetidos: 1 });
    }
  });
  return [...porClave.values()];
};

export default function PadronesList({
  rows = [],
  onInfoClick,
  loading,
  fetchAportes,
  onPrintConsulta,
  onVerGrupoFamiliar,
}) {
  const [filtro, setFiltro] = useState("todos");

  // Cada búsqueda nueva vuelve a mostrar todos los resultados
  useEffect(() => {
    setFiltro("todos");
  }, [rows]);

  const columns = getColumns({
    onPrintConsulta,
    onInfoClick,
    fetchAportes,
    onVerGrupoFamiliar,
  });

  const unicos = useMemo(() => agruparRepetidos(rows), [rows]);
  const conteo = useMemo(() => {
    const vigentes = unicos.filter((r) => r._vigente).length;
    return { todos: unicos.length, vigentes, baja: unicos.length - vigentes };
  }, [unicos]);

  const visibles = useMemo(() => {
    if (filtro === "vigentes") return unicos.filter((r) => r._vigente);
    if (filtro === "baja") return unicos.filter((r) => !r._vigente);
    return unicos;
  }, [unicos, filtro]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        overflow: "hidden",
        ...panelSx,
      }}
    >
      {/* Filtros por estado: solo tienen sentido cuando hay resultados */}
      {unicos.length > 0 && (
      <Stack direction="row" alignItems="center" spacing={1} px={2} py={1.25} borderBottom={1} borderColor="#e1e8eb">
        {FILTROS.map((f) => {
          const activo = filtro === f.value;
          return (
            <Chip
              key={f.value}
              label={`${f.label} ${conteo[f.value]}`}
              onClick={() => setFiltro(f.value)}
              variant={activo ? "filled" : "outlined"}
              sx={{
                fontWeight: 700,
                ...(activo && { bgcolor: MARINO, "& .MuiChip-label": { color: "#fff" }, "&:hover": { bgcolor: MARINO } }),
              }}
            />
          );
        })}
        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto !important" }}>
          Hacé clic en una fila para ver el detalle
        </Typography>
      </Stack>
      )}

      {/* Sin filas: solo el mensaje, sin encabezado de columnas ni paginador */}
      {!loading && visibles.length === 0 ? (
        <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={4}>
          <Typography color="text.secondary" textAlign="center">
            {unicos.length === 0
              ? "Sin resultados. Buscá un afiliado con la barra de arriba."
              : `No hay afiliados ${filtro === "vigentes" ? "vigentes" : "no vigentes"} en esta búsqueda.`}
          </Typography>
        </Box>
      ) : (
        <DataGrid
          density="compact"
          disableColumnMenu
          rows={visibles}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          onRowClick={(params) => onInfoClick(params.row)}
          localeText={dataGridLocaleText}
          getRowClassName={(params) => (params.row._vigente ? "" : "fila-baja")}
          sx={{
            ...dataGridSx,
            flex: 1,
            minHeight: 0,
            width: "100%",
            "& .MuiDataGrid-row": { cursor: "pointer" },
            "& .fila-baja .MuiDataGrid-cell": { color: "#56666e" },
          }}
        />
      )}
    </Box>
  );
}
