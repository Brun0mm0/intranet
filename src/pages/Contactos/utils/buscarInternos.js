import internos from "../../../data/internos.json";

// Minúsculas y sin acentos, para que "recepcion" encuentre "Recepción"
const normalizar = (texto) =>
    (texto ?? "").toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const valoresDeCampo = (contacto, campo) => {
    switch (campo) {
        case "personal":
            return contacto.personal ?? [];
        case "piso":
            return [contacto.piso];
        case "dependencia":
            return [contacto.dependencia];
        default:
            return [contacto.dependencia, contacto.piso, contacto.interno, ...(contacto.personal ?? [])];
    }
};

export const TOTAL_INTERNOS = internos.length;

// campo: "todos" | "personal" | "piso" | "dependencia"
export function buscarInternos(busqueda, campo = "todos") {
    const termino = normalizar(busqueda.trim());
    if (!termino) return internos;
    return internos.filter((contacto) =>
        valoresDeCampo(contacto, campo).some((valor) => normalizar(valor).includes(termino))
    );
}

// 🔹 Área principal de una dependencia: lo que va antes de " - "
// ("Administración y Finanzas - Liquidaciones" → "Administración y Finanzas")
export const areaDe = (contacto) => (contacto.dependencia ?? "").split(" - ")[0].trim();

// Áreas con su cantidad de internos, de la que más tiene a la que menos
export const AREAS = Object.entries(
    internos.reduce((acc, c) => {
        const area = areaDe(c);
        acc[area] = (acc[area] ?? 0) + 1;
        return acc;
    }, {})
)
    .map(([area, cantidad]) => ({ area, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad || a.area.localeCompare(b.area, "es"));
