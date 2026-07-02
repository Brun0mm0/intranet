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

export const parseFechaLocal = (fechaStr) => {
        const [year, month, day] = fechaStr.split('-').map(Number);
        return new Date(year, month - 1, day)
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