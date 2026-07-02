import { useState, useEffect, useRef } from "react";
import { Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export const ListadoDomicilioExplotacion = ({ rows = [], loading }) => {
  const containerRef = useRef(null);
  const [height, setHeight] = useState(400); // valor inicial por seguridad

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        setHeight(newHeight);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const columns = [
    { field: "CUIL_EMPLEADO", headerName: "CUIL", flex: 1 },
    { field: "APELLIDO_NOMBRE_EMPLEADO", headerName: "Nombre Completo", flex: 1.2 },
    { field: "FECHA_INICIO_RELACION_LABORAL", headerName: "Inicio", flex: 1 },
    { field: "FECHA_FIN_RELACION_LABORAL", headerName: "Fin", flex: 1 },
    { field: "CODIGO_OBRA_SOCIAL", headerName: "Obra Social", flex: 1 },
    { field: "CODIGO_MODALIDAD_CONTRATO", headerName: "Contrato", flex: 1 },
  ];

  return (
        <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => rows.indexOf(row)}
        density="compact"
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        sx={{
          border: '1px solid #ddd',
          borderRadius: 1,
          // --- 👇 controla layout interno del DataGrid
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto', // header | rows | footer
          '& .MuiDataGrid-main': {
            overflow: 'hidden',
          },
          '& .MuiDataGrid-virtualScroller': {
            overflowY: 'auto', // 👈 solo las filas scrolleables
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #ddd',
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#fff',
            zIndex: 1, // para que quede sobre las filas
          },
          '& .MuiDataGrid-cell': {
            py: 0.4,
          },
        }}
      />
    </Box>
  );
};

// relacion laboral