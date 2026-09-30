// Estilos compartidos de la intranet. Usar estos en lugar de repetir colores inline.

// Botón de acción principal (Buscar, Crear, Descargar, Cambiar contraseña...)
export const accionButtonSx = {
    borderColor: "rgba(0, 154, 218, 0.5)",
    bgcolor: "rgba(65, 165, 207, 0.2)",
    "&:hover": { bgcolor: "rgba(59, 172, 221, 0.5)" },
};

// Tarjeta blanca plana (barras de búsqueda, tablas, formularios, bloques del inicio)
export const panelSx = {
    bgcolor: "background.paper",
    borderRadius: 3,
    border: 1,
    borderColor: "#e1e8eb",
};

// Degradado institucional (banner de bienvenida, encabezados de página, encabezados de modales)
export const BANNER_BG = "linear-gradient(110deg, #0092c0 0%, #00a9da 45%, #02b57e 100%)";

// Altura común de los encabezados de página (en pantallas angostas pasa a ser mínima)
export const PAGE_HEADER_HEIGHT = 88;
