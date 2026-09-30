// =========================
// PARSEADORES DE FECHA
// =========================

/**
 * Convierte fecha tipo "10.04.2026" → Date
 */
export const parseDotDate = (value) => {
  if (!value || typeof value !== "string") return null;

  const [day, month, year] = value.split(".");
  if (!day || !month || !year) return null;

  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Convierte fecha ISO → Date
 */
export const parseIsoDate = (value) => {
  if (!value) return null;

  // Si es solo fecha (sin hora), parsear como local para evitar UTC offset
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// =========================
// FORMATOS DE FECHA
// =========================

/**
 * Formato: dd/mm/yyyy
 */
export const formatDate = (value) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

/**
 * Formato: dd/mm/yyyy hh:mm
 */
export const formatDateTime = (value) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  // ✅ Antes no incluía la hora aunque el nombre dijera DateTime
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
};

// =========================
// OPERACIONES CON FECHA
// =========================

/**
 * Suma días a una fecha
 */
export const addDays = (date, days) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;

  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// =========================
// FORMATOS NUMÉRICOS
// =========================

/**
 * Formatea moneda ARS
 */
export const formatCurrency = (value) => {
  if (value == null || value === "") return "";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(Number(value));
};