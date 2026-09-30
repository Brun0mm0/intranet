import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchAfiliadoArr } from "../../../store/padrones/thunks";
import { setFiltroSecundario, resetFiltroSecundario } from "../../../store/padrones/padronSlice";

// Auto-búsqueda del buscador único del Padrón (debounce + cola de requests + filtro local).
// Recibe lo que ya resolvió detectarBusqueda: parámetro, valor limpio y filtro.
//
// - La búsqueda al backend se dispara sola cuando el dato está completo (`listo`).
// - El filtro (palabras después del primer apellido) se aplica en el cliente,
//   sin volver a consultar la API.
// - `forzarRef` permite al botón/Enter disparar ya, sin esperar el debounce.
const DEBOUNCE_MS = 400;

// Campo especial del filtro local: busca los términos en apellido y nombre juntos.
export const CAMPO_APELLIDO_NOMBRE = "ApellidoNombre";

export function useBusquedaAutomatica({ param, value, filtro, listo }) {
  const dispatch = useDispatch();

  const debounceRef = useRef(null);
  const ultimaBusquedaRef = useRef(null);
  const enVueloRef = useRef(false);
  const pendienteRef = useRef(null);

  // ✅ Evita requests superpuestos: si ya hay uno en curso, la búsqueda nueva
  // queda pendiente y se dispara al terminar (las intermedias se descartan).
  const dispararBusqueda = (paramBusqueda, valorBusqueda) => {
    if (enVueloRef.current) {
      pendienteRef.current = { param: paramBusqueda, value: valorBusqueda };
      return;
    }

    enVueloRef.current = true;
    dispatch(fetchAfiliadoArr({ param: paramBusqueda, value: valorBusqueda, sinDelay: true })).finally(() => {
      enVueloRef.current = false;
      if (pendienteRef.current) {
        const siguiente = pendienteRef.current;
        pendienteRef.current = null;
        dispararBusqueda(siguiente.param, siguiente.value);
      }
    });
  };

  const ejecutar = (forzar = false) => {
    if (filtro) {
      dispatch(setFiltroSecundario({ valor: filtro, campo: CAMPO_APELLIDO_NOMBRE }));
    } else {
      dispatch(resetFiltroSecundario());
    }

    if (!listo || !param) return;

    // No repetir el mismo request mientras solo cambia el filtro local
    const clave = `${param}:${value}`;
    if (!forzar && clave === ultimaBusquedaRef.current) return;
    ultimaBusquedaRef.current = clave;
    dispararBusqueda(param, value);
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => ejecutar(false), DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param, value, filtro, listo]);

  // Para el botón Buscar / Enter: dispara ya, aunque sea la misma búsqueda.
  const buscarAhora = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    ejecutar(true);
  };

  return { buscarAhora };
}
