import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getColumns } from "../Columns";
import { estaVigente } from "../../../utils/utils";

export default function PadronesList({
  rows = [],
  onInfoClick,
  loading,
  fetchAportes,
  onPrintConsulta,
  onVerGrupoFamiliar,
}) {

  useEffect(() => {
    setFilterModel({ items: [] });
  }, [rows]);

  const [filterModel, setFilterModel] = useState({ items: [] });

  // ✅ Antes: `variant: rows.length > 1 ? "full" : "simple"` hacía que
  // las columnas de acción (ver/aportes/vigencia) aparecieran o no según
  // la cantidad de resultados. Ahora las columnas son siempre las mismas.
  // ✅ Antes: cada columna definía su propia alineación (o ninguna).
  // Ahora se centra header y celdas para todas de una sola vez, salvo que
  // una columna puntual ya lo haya definido explícitamente.
  const columns = getColumns({
    onPrintConsulta,
    onInfoClick,
    fetchAportes,
    onVerGrupoFamiliar,
  }).map((col) => ({
    align: "center",
    headerAlign: "center",
    ...col,
  }));

  // 🔹 Asegurar id único para DataGrid
  const rowsConId = rows.map((row, index) => ({
    id: row.id ?? index,
    ...row,
  }));

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <DataGrid
        density="compact"
        disableColumnMenu
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
        rows={rowsConId}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        localeText={{
          noRowsLabel: "No se encontraron resultados",
          errorOverlayDefaultLabel: "Error al cargar los datos",
        }}
        getRowClassName={(params) => {
          const esActivo = estaVigente(
            params.row.fecha_inicio_cober,
            params.row.fecha_fin_cober
          );

          return esActivo ? "fila-activa" : "fila-baja";
        }}
        sx={{
          width: "100%",
          height: "100%",
          "& .fila-activa": {
            backgroundColor: "#bddab180",
            "&:hover": {
              backgroundColor: "#bddab1",
            },
          },
          "& .fila-baja": {
            backgroundColor: "#dab1b180",
            "&:hover": {
              backgroundColor: "#dab1b1",
            },
          },
          borderRadius: 2,
        }}
      />
    </Box>
  );
}