// 🔹 Detecta qué dato escribió el usuario en el buscador de Control de Facturas.
//
//   30-71234567-8 / 30712345678 → CUIT (11 dígitos; se envía con guiones, como lo guarda el backend)
//   Clínica del Oeste           → Razón social (desde 3 letras)
//   00004-00001138              → N° de factura (número con guion que no es un CUIT)
//   000400001138                → N° de factura (12 o más dígitos)
//   00001138                    → ambiguo: se puede buscar como N° de factura con el botón o Enter
//
// CUIT y razón social buscan solos al completarse; el N° de factura solo con el botón o Enter,
// porque no hay forma de saber cuándo terminó de escribirse.

export const ETIQUETAS = {
    cuit: "CUIT",
    razon_social: "Razón social",
    numero_factura: "N° de factura",
};

export const TIPOS = ["cuit", "razon_social", "numero_factura"];

const MIN_LETRAS = 3;
const CUIT_CON_GUIONES = /^\d{2}-\d{8}-\d$/;
const NUMERICO = /^[\d\s-]+$/;

export const formatCuit = (digitos) => {
    const d = digitos.slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 10) return `${d.slice(0, 2)}-${d.slice(2)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}`;
};

/**
 * @returns {{ param: string|null, value: string|null, listo: boolean, auto: boolean, mensaje: string|null }}
 *   listo: se puede buscar (botón/Enter) · auto: además se busca solo mientras se escribe
 */
export function detectarBusquedaFacturas(texto, tipoForzado = null) {
    const limpio = (texto ?? "").trim();
    const base = { param: tipoForzado, value: null, listo: false, auto: false, mensaje: null };
    if (!limpio) return base;

    if (NUMERICO.test(limpio)) {
        const digitos = limpio.replace(/\D/g, "");

        if (tipoForzado === "razon_social") {
            return { ...base, mensaje: "Para buscar por razón social escribí letras." };
        }
        if (tipoForzado === "cuit" || (!tipoForzado && (digitos.length === 11 || CUIT_CON_GUIONES.test(limpio)))) {
            const listo = digitos.length === 11;
            return { ...base, param: "cuit", value: formatCuit(digitos), listo, auto: listo, mensaje: listo ? null : "El CUIT tiene 11 dígitos." };
        }
        if (tipoForzado === "numero_factura" || limpio.includes("-") || digitos.length >= 12) {
            return { ...base, param: "numero_factura", value: limpio.replace(/\s/g, ""), listo: true, mensaje: "Presioná Buscar o Enter para buscar el N° de factura." };
        }
        // Menos de 11 dígitos sin guion: puede ser un CUIT a medio escribir o un N° de factura
        return {
            ...base,
            value: limpio,
            listo: true,
            param: null,
            mensaje: "CUIT: 11 dígitos. Si es un N° de factura, presioná Buscar.",
        };
    }

    if (tipoForzado === "cuit" || tipoForzado === "numero_factura") {
        return { ...base, mensaje: `Para buscar por ${ETIQUETAS[tipoForzado]} escribí números.` };
    }
    const listo = limpio.length >= MIN_LETRAS;
    return {
        ...base,
        param: "razon_social",
        value: limpio,
        listo,
        auto: listo,
        mensaje: listo ? null : `Escribí al menos ${MIN_LETRAS} letras.`,
    };
}
