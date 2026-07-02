import { AfiliadoView } from "./AfiliadoView";
import { AportesList } from "./AportesList";

export default function PadronModal({ open, handleClose, data, historial, aportes, loading }) {
  
  // if (!data) return null;

  const excludedKeys = [
  "id",
  "Nro_Afil",
  "Nombre",
  "Apellido",
  "ben_id",
  "Tipo_cobertura_cod",
  "historial_coberturas",
  "Zona_id",
  "Empresa_id",
  "Provincia_cod",
  "Sucursal_id",
  "fecha_inicio_cober_year_month",
  "Localidad_cod",
  "Parentesco_cod",
  "Rep_id",
];

  const shouldRenderField = (key) => !excludedKeys.includes(key);

  if(open === 'afiliado' && data) { 
    return <AfiliadoView shouldRenderField={shouldRenderField} data={data} historial={historial} handleClose={handleClose} open={true} />
  }

  if (open === 'aportes') { 
    return <AportesList open={true} rows={aportes} handleClose={handleClose} loading={loading} />
  }

  return null
}
