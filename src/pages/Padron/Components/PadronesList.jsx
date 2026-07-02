import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Popover, Typography} from "@mui/material";
import { useState, useEffect } from "react";
import { PadronesHistorial } from "./PadronesHistorial";
import { getColumns } from "../Columns";
import { estaVigente } from "../../../utils/utils";

export default function PadronesList({ 
  rows = [], 
  onInfoClick, 
  loading, 
  fetchAportes, 
  onPrintConsulta}) {

  useEffect(() => {
    setFilterModel({ items: [] });
  }, [rows]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [filterModel, setFilterModel] = useState({ items:[]})

  // 🔹 Manejo popover historial
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget)
    setHistorial(row.historial_coberturas || []);
  };

  const handleClose = () => setAnchorEl(null);

  // 🔹 Generación de columnas (externo)
  const columns = getColumns({
    variant: rows.length > 1 ? "full" : "simple",
    onPrintConsulta,
    handleClick,
    onInfoClick,
    fetchAportes
  })

  // 🔹 Asegurar id único para DataGrid
  const rowsConId = rows.map((row, index) => ({
    id: row.id ?? index,
    ...row
  }))

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        // padding: 1,
        // paddingY: 2
      }}
    >
      <DataGrid
        density="compact"
        filterModel={filterModel}
        onFilterModelChange={(model)=> setFilterModel(model)}
        disableSelectionOnClick
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
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box p={2}>
          {Array.isArray(historial) && historial.length > 0 ? (
            <PadronesHistorial historial={historial} />
          ) : (
            <Typography>No hay historial</Typography>
          )}
        </Box>
      </Popover>
    </Box>
  );
}
