import { useMemo, useState } from "react";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PageHeader, { HeaderButton, HeaderField, HeaderPills } from "../../../components/common/PageHeader";
import { useBusquedaAutomatica } from "../hooks/Usebusquedaautomatica";
import { detectarBusqueda, ETIQUETAS, TIPOS } from "../utils/detectarBusqueda";

const PLACEHOLDER = {
  dni: "Número de DNI",
  cuil: "CUIL, con o sin guiones",
  Nro_Afil: "Número de afiliado",
  apellido: "Apellido (y nombre)",
  nombre: "Nombre",
};

const OPCIONES = TIPOS.map((tipo) => ({ value: tipo, label: ETIQUETAS[tipo] }));

// 🔹 Buscador del Padrón.
// Las pastillas muestran el tipo que se detecta mientras se escribe (CUIL, DNI,
// N° de afiliado, apellido o "apellido nombre") y se puede hacer clic para forzar otro.
// Busca solo cuando el dato está completo; el botón y Enter buscan en el momento.
export default function PadronesBar({ loading }) {
  const [texto, setTexto] = useState("");
  const [tipoForzado, setTipoForzado] = useState(null);

  const deteccion = useMemo(() => detectarBusqueda(texto, tipoForzado), [texto, tipoForzado]);

  const { buscarAhora } = useBusquedaAutomatica(deteccion);

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarAhora();
  };

  // Clic en la pastilla activa elegida a mano: vuelve a la detección automática
  const elegirTipo = (tipo) => setTipoForzado((actual) => (actual === tipo ? null : tipo));

  return (
    <PageHeader
      component="form"
      onSubmit={handleSubmit}
      icon={<GroupsRoundedIcon />}
      title="Buscar afiliado"
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
        id="padron-busqueda"
        name="busqueda"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={tipoForzado ? PLACEHOLDER[tipoForzado] : "DNI, CUIL, N° de afiliado o apellido y nombre"}
        autoFocus
        helperText={deteccion.mensaje}
      />
    </PageHeader>
  );
}
