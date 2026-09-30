import { useEffect, useMemo, useRef, useState } from "react";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { useDispatch } from "react-redux";
import PageHeader, { HeaderButton, HeaderField, HeaderPills } from "../../../components/common/PageHeader";
import { fetchConsultaFacturas } from "../../../store/prestaciones/thunks";
import { detectarBusquedaFacturas, ETIQUETAS, TIPOS } from "../utils/detectarBusquedaFacturas";

const DEBOUNCE_MS = 500;

const PLACEHOLDER = {
  cuit: "CUIT, con o sin guiones",
  razon_social: "Razón social del proveedor",
  numero_factura: "Número de factura, ej. 00004-00001138",
};

const OPCIONES = TIPOS.map((tipo) => ({ value: tipo, label: ETIQUETAS[tipo] }));

// 🔹 Buscador de Control de Facturas con el mismo estilo que el Padrón.
// Las pastillas muestran el tipo detectado y se puede hacer clic para forzar otro.
// CUIT y razón social buscan solos; el N° de factura, con el botón o Enter.
export const PrestacionesBar = ({ loading, errorText = null, onSearchParamChange }) => {
  const dispatch = useDispatch();
  const [texto, setTexto] = useState("");
  const [tipoForzado, setTipoForzado] = useState(null);
  const ultimaBusquedaRef = useRef(null);

  const deteccion = useMemo(() => detectarBusquedaFacturas(texto, tipoForzado), [texto, tipoForzado]);

  const buscar = (param, value, forzar = false) => {
    const clave = `${param}:${value}`;
    if (!forzar && clave === ultimaBusquedaRef.current) return;
    ultimaBusquedaRef.current = clave;
    onSearchParamChange(param);
    dispatch(fetchConsultaFacturas({ param, value }));
  };

  // Búsqueda automática para CUIT completo y razón social
  useEffect(() => {
    if (!deteccion.auto) return;
    const id = setTimeout(() => buscar(deteccion.param, deteccion.value), DEBOUNCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deteccion.auto, deteccion.param, deteccion.value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deteccion.listo) return;
    // Número corto sin tipo claro: se busca como N° de factura
    buscar(deteccion.param ?? "numero_factura", deteccion.value, true);
  };

  const elegirTipo = (tipo) => setTipoForzado((actual) => (actual === tipo ? null : tipo));
  const mensaje = errorText ?? deteccion.mensaje;

  return (
    <PageHeader
      component="form"
      onSubmit={handleSubmit}
      icon={<ReceiptLongRoundedIcon />}
      title="Buscar facturas"
      actions={
        <HeaderButton type="submit" loading={loading} disabled={!deteccion.listo}>
          Buscar
        </HeaderButton>
      }
    >
      <HeaderPills
        options={OPCIONES}
        value={deteccion.param}
        onChange={elegirTipo}
        titleForActive={tipoForzado ? "Clic para volver a la detección automática" : undefined}
      />
      <HeaderField
        id="facturas-busqueda"
        name="busqueda"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={tipoForzado ? PLACEHOLDER[tipoForzado] : "CUIT, razón social o N° de factura"}
        autoFocus
        helperText={mensaje}
      />
    </PageHeader>
  );
};
