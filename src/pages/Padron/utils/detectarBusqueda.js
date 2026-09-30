// 🔹 Detecta qué dato escribió el usuario en el buscador del Padrón.
// Devuelve cómo buscarlo en el backend. Si el usuario elige un tipo en las pastillas,
// ese tipo manda y solo se valida que el dato tenga el formato correcto.
//
//   20-31402118-3 / 20314021183 → CUIL (11 dígitos)
//   31402118                    → DNI (7-8 dígitos)
//   702184500                   → N° de afiliado (9-10 dígitos)
//   peña                        → Apellido
//   peña luis / peña, luis      → Apellido "peña" + filtro local por "luis"
//                                  (en apellido o nombre, así "gomez peralta" también funciona)

export const MIN_LETRAS = 2;

export const ETIQUETAS = {
    dni: "DNI",
    cuil: "CUIL",
    Nro_Afil: "N° de afiliado",
    apellido: "Apellido",
    nombre: "Nombre",
};

// Tipos que se muestran como pastillas, en orden
export const TIPOS = ["dni", "cuil", "Nro_Afil", "apellido", "nombre"];

// Cantidad de dígitos válida para cada tipo numérico [mín, máx]
const DIGITOS = { dni: [7, 8], cuil: [11, 11], Nro_Afil: [1, 10] };

// Letras (con acentos y ñ), espacios, apóstrofo, guion y coma
const TEXTO_VALIDO = /^[\p{L}\s'’,-]+$/u;
const NUMERICO = /^[\d\s.-]+$/;

const rango = ([min, max]) => (min === max ? `${min}` : `${min} a ${max}`);

// Se sacan los acentos pero se conserva la ñ: el padrón guarda los nombres sin tildes.
export const normalizarNombre = (texto) =>
    Array.from(texto)
        .map((c) => (c === "ñ" || c === "Ñ" ? c : c.normalize("NFD").replace(/\p{Diacritic}/gu, "")))
        .join("");

/**
 * @param {string} texto lo que escribió el usuario
 * @param {string|null} tipoForzado tipo elegido a mano en las pastillas (null = detectar solo)
 * @returns {{
 *   clase: "vacio"|"numero"|"texto"|"invalido",
 *   param: string|null,      // parámetro para el backend (y pastilla resaltada)
 *   value: string|null,      // valor limpio para el backend
 *   filtro: string|null,     // términos para filtrar localmente (texto después del primer apellido)
 *   listo: boolean,          // si ya se puede buscar
 *   mensaje: string|null,    // ayuda a mostrar cuando todavía no se puede buscar
 * }}
 */
export function detectarBusqueda(texto, tipoForzado = null) {
    const limpio = (texto ?? "").trim();
    const base = { param: tipoForzado, value: null, filtro: null, listo: false, mensaje: null };

    if (!limpio) return { ...base, clase: "vacio" };

    if (NUMERICO.test(limpio)) {
        const digitos = limpio.replace(/\D/g, "");
        const n = digitos.length;

        if (tipoForzado === "apellido" || tipoForzado === "nombre") {
            return { ...base, clase: "numero", mensaje: `Para buscar por ${ETIQUETAS[tipoForzado].toLowerCase()} escribí letras.` };
        }

        if (tipoForzado) {
            const listo = n >= DIGITOS[tipoForzado][0] && n <= DIGITOS[tipoForzado][1];
            return {
                ...base, clase: "numero", value: digitos, listo,
                mensaje: listo ? null : `El ${ETIQUETAS[tipoForzado]} tiene ${rango(DIGITOS[tipoForzado])} dígitos.`,
            };
        }

        // Detección automática
        const param = n === 11 ? "cuil" : n === 7 || n === 8 ? "dni" : n === 9 || n === 10 ? "Nro_Afil" : null;
        if (!param) {
            return {
                ...base, clase: "numero", value: digitos,
                mensaje: n > 11 ? "Demasiados dígitos: un CUIL tiene 11." : "Seguí escribiendo: DNI 7-8 dígitos, N° de afiliado 9-10, CUIL 11.",
            };
        }
        return { ...base, clase: "numero", param, value: digitos, listo: true };
    }

    if (TEXTO_VALIDO.test(limpio)) {
        if (tipoForzado && DIGITOS[tipoForzado]) {
            return { ...base, clase: "texto", mensaje: `Para buscar por ${ETIQUETAS[tipoForzado]} escribí solo números.` };
        }
        const [primera, ...resto] = normalizarNombre(limpio).split(/[\s,]+/).filter(Boolean);
        const listo = primera.length >= MIN_LETRAS;
        return {
            ...base,
            clase: "texto",
            param: tipoForzado ?? "apellido",
            value: primera,
            filtro: resto.length ? resto.join(" ") : null,
            listo,
            mensaje: listo ? null : `Escribí al menos ${MIN_LETRAS} letras.`,
        };
    }

    return { ...base, clase: "invalido", param: null, mensaje: "Usá solo números o solo letras." };
}
