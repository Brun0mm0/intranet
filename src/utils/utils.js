export const afiliadoParse = (data) => {
    const [afiliado] = data;
    return {
    id: afiliado.ben_id,
    ben_id: afiliado.ben_id,
    Tipo_Doc: afiliado.Tipo_Doc,
    Apellido: afiliado.Apellido,
    Nombre: afiliado.Nombre,
    Nro_Afil: afiliado.Nro_Afil,
    Nro_Doc: afiliado.Nro_Doc,
    CUIL: afiliado.CUIL,
    Parentesco: afiliado.Parentesco,
    Sexo: afiliado.Sexo,
    Fecha_Nac: afiliado.Fecha_Nac,
    Plan: afiliado.Plan,
    Tipo_cobertura: afiliado.Tipo_cobertura,
    fecha_inicio_cober: afiliado.fecha_inicio_cober,
    fecha_fin_cober: afiliado.fecha_fin_cober,
    Domicilio: afiliado.Domicilio,
    CP: afiliado.CP,
    Localidad: afiliado.Localidad,
    Provincia: afiliado.Provincia?.trim(),
    Sucursal: afiliado.Sucursal,
    Zona: afiliado.Zona,
    Empresa: afiliado.Empresa?.trim(),
    Empresa_Cuit: afiliado.Empresa_Cuit?.trim(),
    Reparticion: afiliado.Reparticion,
    fecha_inicio_cober_mes: afiliado.fecha_inicio_cober_month,
    fecha_inicio_cober_año: afiliado.fecha_inicio_cober_year,
    Telefonos: afiliado.telefonos?.trim(),
    Celular: afiliado.celular,
    Fecha_Registro: afiliado.FechaRegistro,
    }
    }

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ✅ Antes: solo parseaba formato ISO "YYYY-MM-DD" (split por '-').
// El historial_coberturas de la API viene en formato "DD/MM/YYYY" (con
// barras), así que con fechas de historial esto devolvía una fecha
// inválida (NaN) en vez de romper explícitamente. Ahora detecta el
// separador y parsea según corresponda, sin tener que tocar quién llama
// a esta función ni a estaVigente.
export const parseFechaLocal = (fechaStr) => {
        if (!fechaStr) return null;

        if (fechaStr.includes('-')) {
            // Formato ISO: YYYY-MM-DD
            const [year, month, day] = fechaStr.split('-').map(Number);
            return new Date(year, month - 1, day);
        }

        // Formato argentino: DD/MM/YYYY
        const [day, month, year] = fechaStr.split('/').map(Number);
        return new Date(year, month - 1, day);
    }

export const estaVigente = (fechaInicioCoberStr, fechaFinCoberStr) => {

        if (!fechaInicioCoberStr) return false;

            const hoy = new Date();
            hoy.setHours(0,0,0,0);
            const fechaInicio = parseFechaLocal(fechaInicioCoberStr);
            fechaInicio.setHours(0,0,0,0);
            const fechaCaducidad = fechaFinCoberStr
                ? parseFechaLocal(fechaFinCoberStr)
                : null;
            if (fechaCaducidad) fechaCaducidad.setHours(0,0,0,0);
            const inicioOk = fechaInicio.getTime() <= hoy.getTime();
            const caducidadOk = !fechaCaducidad || fechaCaducidad.getTime() >= hoy.getTime();

        return inicioOk && caducidadOk
    }

export const formatCuil = (value) => {
        // eliminar todo lo que no sea número
        const numbers = value.replace(/\D/g, '')

        const part1 = numbers.slice(0, 2)
        const part2 = numbers.slice(2, 10)
        const part3 = numbers.slice(10, 11)

        let formatted = part1

        if (part2) formatted += `-${part2}`
        if (part3) formatted += `-${part3}`

        return formatted
        }    

export const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    // método moderno
    await navigator.clipboard.writeText(text);
  } else {
    // fallback para http
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-999999px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Error copiando", err);
    }

    document.body.removeChild(textarea);
  }
};
// 🔹 Formateo para mostrar datos del padrón (no se usan para enviar al backend)

// "2022-12-01" → "01/12/2022". Si ya viene como DD/MM/YYYY (o no es fecha) se devuelve igual.
export const formatFecha = (fechaStr) => {
    if (!fechaStr) return null;
    const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(fechaStr));
    return iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : String(fechaStr);
};

// 20360754279 → "20-36075427-9". Si no tiene 11 dígitos se devuelve igual.
export const formatCuilTexto = (cuil) => {
    if (cuil == null || cuil === '') return null;
    const digitos = String(cuil).replace(/\D/g, '');
    return digitos.length === 11 ? formatCuil(digitos) : String(cuil);
};

// 36075427 → "36.075.427"
export const formatDni = (dni) => {
    if (dni == null || dni === '') return null;
    const digitos = String(dni).replace(/\D/g, '');
    return digitos ? Number(digitos).toLocaleString('es-AR') : String(dni);
};

// Limpia texto que llega sucio del backend: espacios de más, "SAN MARTIN ,PTDO." y separadores colgando ("1167800827 /").
export const limpiarTexto = (texto) => {
    if (texto == null) return null;
    const limpio = String(texto)
        .replace(/\s+/g, ' ')
        .replace(/\s+,/g, ',')
        .replace(/,(?=\S)/g, ', ')
        .replace(/[\s/,;-]+$/, '')
        .replace(/^[\s/,;-]+/, '')
        .trim();
    return limpio || null;
};

// "GRAN BUENOS AIRES ZONA OESTE 1" → "Gran Buenos Aires Zona Oeste 1". Siglas cortas sin vocales (DU, CP) quedan igual.
const MINUSCULAS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'e', 'en', 'a', 'al', 'por', 'con']);
export const capitalizar = (texto) => {
    const limpio = limpiarTexto(texto);
    if (!limpio) return null;
    return limpio
        .toLowerCase()
        .split(' ')
        .map((palabra, i) => {
            if (i > 0 && MINUSCULAS.has(palabra)) return palabra;
            if (palabra.length <= 3 && !/[aeiouáéíóú]/.test(palabra) && /[a-zñ]/.test(palabra)) return palabra.toUpperCase();
            return palabra.charAt(0).toUpperCase() + palabra.slice(1);
        })
        .join(' ');
};

// Edad en años a partir de "DD/MM/YYYY" o "YYYY-MM-DD"
export const calcularEdad = (fechaStr) => {
    const nac = parseFechaLocal(fechaStr);
    if (!nac || isNaN(nac)) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - nac.getFullYear();
    const cumplioEsteAnio = hoy.getMonth() > nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() >= nac.getDate());
    if (!cumplioEsteAnio) edad -= 1;
    return edad >= 0 ? edad : null;
};
