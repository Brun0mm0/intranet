// 🔹 Diccionario de códigos de parentesco → descripción.
// El campo "Parentesco" que devuelve el backend viene null en algunas
// búsquedas (ej. grupo familiar); el código real siempre está en
// "Parentesco_cod", así que la columna se arma a partir de ese código.
export const PARENTESCO_COD = {
  A: "Conyuge",
  B: "Concubino/a",
  C: "Concubino/a 1.5",
  D: "Ex cónyuge",
  E: "Hijo/a",
  F: "Hijo/a del conyuge",
  G: "Men.Guarda",
  H: "Hermanos",
  I: "Nieto/a",
  J: "Hermanos",
  K: "Padres",
  L: "Padres Politicos",
  M: "Sobrinos",
  N: "Personas a cargo",
  O: "CoTitular",
  P: "Subsidiario",
  Q: "Otros a cargo",
  R: "Padres c/aportes",
  S: "Titular",
  T: "Hijo/a del concubino",
  V: "Ex Esposa c/aportes",
  W: "Error de carga",
  X: "Hijo recien nacido",
  Y: "Men.Guarda SIN ap",
  Z: "Hijo/a Aportante",
};

// ✅ Columnas con ancho flexible (antes anchos fijos que dejaban 40% de la
// tabla vacía y cortaban los títulos). "Apellido y nombre" está en
// actionColumns.jsx porque necesita JSX para marcar los registros repetidos.
export const baseColumns = [
  {
    field: "Parentesco",
    headerName: "Parentesco",
    flex: 1,
    minWidth: 130,
    // ✅ Antes mostraba directamente params.value (a veces null).
    // Ahora resuelve siempre por el código, con el texto crudo como
    // respaldo si el código no está en el diccionario.
    valueGetter: (value, row) => PARENTESCO_COD[row.Parentesco_cod] ?? value ?? "—",
  },
  { field: "Plan", headerName: "Plan", flex: 0.6, minWidth: 80 },
  { field: "Sexo", headerName: "Sexo", width: 70 },
];
