import { baseColumns } from "./baseColumns";
import { getStatusColumn, getNombreColumn, getCopyColumns, getActionsColumn } from "./actionColumns";

// La lista se ve siempre igual, sin importar cuántos objetos devuelva la API,
// y "Acciones" queda como la última columna de la fila.
export const getColumns = (config) => [
  getStatusColumn(),
  getNombreColumn(),
  ...baseColumns,
  ...getCopyColumns(),
  getActionsColumn(config),
];
