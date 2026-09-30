import { Box, Stack, Typography, Button, FormControl, InputLabel, OutlinedInput, InputAdornment} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { getFacturasColumns } from "../columns/facturasColumns";
import DownloadIcon from "@mui/icons-material/Download";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as XLSX from "xlsx";
import { panelSx } from "../../../shared-theme/customizations/intranetStyles";


export const PrestacionesTabla = ({
    loading,
    rows, 
    proveedor,
    searchParam
  }) => {

    const columns = getFacturasColumns(searchParam);

    useEffect(() => {
        setFilterModel({ items: [] });
      }, [rows]);
    const [filterModel, setFilterModel] = useState({ items:[]})

      const rowsConId = rows.map((row, index) => ({
        id: row.ID ?? index,
        ...row
    }))
    
    const [filterText, setFilterText] = useState("");

    const [facturaFilterText, setFacturaFilterText] = useState("");
    
        const showProveedorHeader =
      (searchParam === "cuit" || searchParam === "razon_social") &&
      Boolean(proveedor?.razon_social);

    const showInternalFilter = searchParam === "numero_factura";

    const handleDownloadExcel = (nombreArchivo) => {
      if (!rowsConId.length) return;

      // Quitamos el id interno si no querés exportarlo
      const dataToExport = rowsConId.map(({ id, ...row }) => row);

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Prestaciones");

      XLSX.writeFile(workbook, nombreArchivo || "prestaciones.xlsx");
    };

    const filteredRows = rowsConId.filter((row) => {
      const search = filterText.toLowerCase().trim();
      const facturaSearch = facturaFilterText.trim();

      if (showInternalFilter && search) {
          return (
            row.PRV_CUIT?.toLowerCase().includes(search) ||
            row.PRV_RAZON_SOCIAL?.toLowerCase().includes(search)
          );
        }

        if (showProveedorHeader && facturaSearch) {
          const comprobante = `${row.CTE_PRENUMERO ?? ""}${row.CTE_NUMERO ?? ""}`;
          const comprobanteConGuion = `${row.CTE_PRENUMERO ?? ""}-${row.CTE_NUMERO ?? ""}`;

          return (
            comprobante.includes(facturaSearch.replace(/\D/g, "")) ||
            comprobanteConGuion.includes(facturaSearch)
          );
        }

        return true;
    });

  return (
      <Box
      sx={{ 
        flexGrow: 1,
        display: "flex",
        width: "100%",
        minHeight: 0,
        flexDirection: "column",
        ...panelSx,
        padding: 1,
        paddingY: 2,
      }}
    >
      {showProveedorHeader && proveedor?.razon_social && (
        <Stack mx={2} pb={2} direction="row" justifyContent="space-between">
           <Stack>
            <Typography variant="subtitle1" align="start">
              {proveedor.razon_social}  
            </Typography>
            <Typography variant="subtitle2" mb={1}  align="start">
              CUIT: {proveedor.cuit}
        </Typography>
         <Stack mx={2} pb={2} direction={"row"} spacing={2} alignItems={"center"}>
          <InputLabel sx={{ minWidth: 180 }}>
            Filtrar por CUIT o Razón Social
          </InputLabel>

      {/* Input */}
        <FormControl variant="outlined" size="small" sx={{ width: 300 }}>
          <OutlinedInput
          value={facturaFilterText}
            onChange={(e) => setFacturaFilterText(e.target.value)}
            
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        </Stack>
          </Stack>
        <Button 
          variant="outlined" 
          startIcon={<DownloadIcon />} 
          onClick={() => handleDownloadExcel(`${proveedor.cuit} - ${proveedor.razon_social}.xlsx`)}
          sx={{

          }}
          >
          Descargar en archivo Excel
        </Button>
        </Stack>
      )}

      {showInternalFilter && rows.length > 0 && (
        <Stack mx={2} pb={2} direction={"row"} spacing={2} alignItems={"center"}>
          <InputLabel sx={{ minWidth: 180 }}>
            Filtrar por CUIT o Razón Social
          </InputLabel>

      {/* Input */}
        <FormControl variant="outlined" size="small" sx={{ width: 300 }}>
          <OutlinedInput
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        </Stack>
      )}
        <DataGrid
          loading={loading}
          density="compact"
          checkboxSelection={false}
          rows={filteredRows} 
          columns={columns}
          filterModel={filterModel}
          onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
          getRowClassName={(params)=> {
            const fac = params.row.CTE_TIPO;
              if(fac === 'FAC') return 'factura';
              if(fac === 'OP') return 'orden-de-pago';
              if(fac === 'NC') return 'nota-credito';
            return '';
          }}
          sx={{
             width: "100%",
          height: "100%",
          "& .factura": {
            backgroundColor: "#cfe2f3",
          "&:hover": {
            backgroundColor: "#9fc5e8",
          },
          },
          "& .orden-de-pago": {
            backgroundColor: "#ffecb5",
          "&:hover": {
            backgroundColor: "#fff2cc",
          },
          },
          "& .nota-credito": {
            backgroundColor: "#efefef",
          "&:hover": {
            backgroundColor: "#d9d9d9",
          },
          },
          }}
        />
    </Box>
  )
}
