import { baseColumns } from "./baseColumns";
import { getStatusColumn, getCopyColumns, getActionsColumn } from "./actionColumns";

// ✅ Antes: `variant` ("simple"/"full") decidía qué columnas se mostraban
// según la cantidad de resultados (rows.length > 1), y el if/else acá
// adentro no hacía ninguna diferencia real entre los dos casos.
// Ahora la lista se ve siempre igual, sin importar cuántos objetos
// devuelva la API, y "Acciones" queda como la última columna de la fila.
export const getColumns = (config) => [
  getStatusColumn(),
  ...baseColumns,
  ...getCopyColumns(),
  getActionsColumn(config),
];