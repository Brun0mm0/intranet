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

export const baseColumns = [
  { field: "Apellido", headerName: "Apellido", width: 150 },
  { field: "Nombre", headerName: "Nombre", width: 150 },
  { field: "Plan", headerName: "Plan", width: 80 },
  { field: "Tipo_Doc", headerName: "Tipo", width: 40 },
  {
    field: "Parentesco",
    headerName: "Parentesco",
    width: 130,
    // ✅ Antes mostraba directamente params.value (a veces null).
    // Ahora resuelve siempre por el código, con el texto crudo como
    // respaldo si el código no está en el diccionario.
    renderCell: (params) => {
      const cod = params.row.Parentesco_cod;
      return PARENTESCO_COD[cod] ?? params.value ?? "—";
    },
  },
  { field: "Sexo", headerName: "Sexo", width: 50 },
];