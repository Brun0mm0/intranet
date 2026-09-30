import { esES } from "@mui/x-data-grid/locales";

// Textos del DataGrid en español ("Filas por página", "Sin resultados", etc.)
export const dataGridLocaleText = esES.components.MuiDataGrid.defaultProps.localeText;

// Acento oscuro de la intranet (filtro activo, etc.)
export const MARINO = "#0b3b4f";

// Encabezado de tabla: gris claro con texto oscuro en mayúsculas (mismo criterio en DataGrid y en Table).
export const HEADER_BG = "#f1f5f7";
export const HEADER_COLOR = "#33434a";

export const tableHeadSx = {
    "& th": {
        bgcolor: HEADER_BG,
        color: HEADER_COLOR,
        fontWeight: 700,
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        borderBottom: "1px solid #e1e8eb",
    },
};

// Tabla con filas blancas y encabezado claro: el criterio de contraste de la intranet.
export const dataGridSx = {
    border: 0,
    "& .MuiDataGrid-columnHeader": {
        bgcolor: HEADER_BG,
        color: HEADER_COLOR,
    },
    "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: 700,
        fontSize: "0.75rem",
        letterSpacing: "0.03em",
        textTransform: "uppercase",
    },
    "& .MuiDataGrid-columnHeaders .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller--header": {
        bgcolor: HEADER_BG,
    },
    "& .MuiDataGrid-columnSeparator": { color: "#d9e3e8" },
    "& .MuiDataGrid-row:hover": { bgcolor: "#f2f9fc" },
    "& .MuiDataGrid-cell": { borderColor: "#edf1f3", fontVariantNumeric: "tabular-nums" },
    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
};
