import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchAfiliadoArr } from "../../../store/padrones/thunks";
import { setFiltroSecundario, resetFiltroSecundario } from "../../../store/padrones/padronSlice";

// ✅ Extraído de PadronesBar.jsx: todo el sistema de auto-búsqueda
// (debounce + cola de requests + filtro secundario por coma) vive acá,
// autocontenido y sin JSX — así PadronesBar queda enfocado solo en el
// formulario.
//
// Apellido y Nombre buscan solas (sin botón): al llegar a 2 caracteres
// se dispara la búsqueda al backend con una pausa breve (debounce), y
// agregando una coma se puede filtrar el resultado por el campo
// complementario sin golpear la API de nuevo — ej: "pr,br" busca
// apellidos que empiecen con "pr" y filtra, sobre esos resultados, los
// que tengan nombre que empiece con "br".
const MIN_CARACTERES_AUTOBUSQUEDA = 2;
const DEBOUNCE_MS = 400;
// ✅ Mismo criterio que validarInputPadron para nombre/apellido: solo
// letras y espacios. Si el texto tiene números o símbolos, no dispara
// la búsqueda al backend.
const SOLO_LETRAS = /^[a-zA-Z\s]+$/;

export function useBusquedaAutomatica({ activo, param, value }) {
  const dispatch = useDispatch();

  const debounceRef = useRef(null);
  const ultimaBusquedaRef = useRef(null);
  const enVueloRef = useRef(false);
  const pendienteRef = useRef(null);

  // ✅ Evita requests superpuestos: si ya hay un fetchAfiliadoArr en curso,
  // la búsqueda nueva se guarda como "pendiente" en vez de dispararse ya
  // mismo. Cuando el request en vuelo termina, se dispara automáticamente
  // la más reciente que haya quedado pendiente (las intermedias se
  // descartan, no hace falta repetirlas).
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

  useEffect(() => {
    if (!activo) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const [primeraParteRaw, segundaParteRaw] = value.split(",");
      const primeraParte = (primeraParteRaw ?? "").trim();
      const segundaParte = (segundaParteRaw ?? "").trim();

      // 🔹 Filtro secundario (después de la coma) — cliente-side, no
      // dispara ningún request nuevo.
      if (segundaParte) {
        const campoSecundario = param === "apellido" ? "Nombre" : "Apellido";
        dispatch(setFiltroSecundario({ valor: segundaParte, campo: campoSecundario }));
      } else {
        dispatch(resetFiltroSecundario());
      }

      // 🔹 Búsqueda principal (antes de la coma) — solo si son solo letras,
      // y si cambió respecto a la última vez que se disparó, para no
      // repetir el mismo request en cada tecla que se toca después de
      // la coma.
      const claveBusqueda = `${param}:${primeraParte}`;
      if (
        primeraParte.length >= MIN_CARACTERES_AUTOBUSQUEDA &&
        SOLO_LETRAS.test(primeraParte) &&
        claveBusqueda !== ultimaBusquedaRef.current
      ) {
        ultimaBusquedaRef.current = claveBusqueda;
        dispararBusqueda(param, primeraParte);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [value, param, activo]);

  // ✅ Al cambiar de radio, se invalida la última búsqueda recordada para
  // que un mismo texto pueda volver a dispararse bajo el nuevo criterio.
  useEffect(() => {
    ultimaBusquedaRef.current = null;
  }, [param]);
}