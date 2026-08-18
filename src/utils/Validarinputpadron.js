// ✅ Extraído de PadronesBar.jsx: es una función pura (sin JSX ni estado),
// no necesitaba vivir dentro del componente.
export function validarInputPadron(valor, tipo, plan) {
  const cleanValue = valor.replace(/\D/g, "");

  if (!valor && !plan) return "Este campo es obligatorio";

  if (tipo === "dni" && !plan) {
    return /^\d{7,8}$/.test(cleanValue)
      ? null
      : "El DNI debe tener 7 u 8 dígitos";
  }

  if (tipo === "cuil") {
    return /^\d{11}$/.test(cleanValue)
      ? null
      : "El CUIL debe tener 11 dígitos";
  }

  if (tipo === "Nro_Afil") {
    return /^\d{1,10}$/.test(cleanValue)
      ? null
      : "El número de afiliado debe ser un número de hasta 10 dígitos";
  }

  if (tipo === "nro_cobertura") {
    return /^\d+$/.test(cleanValue)
      ? null
      : "El número de cobertura debe contener solo números";
  }

  if (tipo === "nombre" || tipo === "apellido") {
    return /^[a-zA-Z\s]+$/.test(valor)
      ? null
      : "Solo puede contener letras y espacios";
  }

  return null;
}