import { AfiliadoView } from "./AfiliadoView";
import { AportesList } from "./AportesList";

// ✅ Antes: un solo "type" ('afiliado' | 'aportes') decidía cuál de los
// dos modales se mostraba, así que abrir Aportes desde adentro del
// detalle cerraba el modal de detalle. Ahora son dos flags independientes:
// pueden estar abiertos los dos a la vez (Aportes se apila arriba).
export default function PadronModal({
  afiliadoOpen,
  data,
  detalleLoading,
  historial,
  handleCloseAfiliado,
  onImprimir,
  onVerAportes,

  aportesOpen,
  aportes,
  aportesLoading,
  handleCloseAportes,
}) {
  return (
    <>
      {afiliadoOpen && (
        <AfiliadoView
          data={data}
          loading={detalleLoading}
          historial={historial}
          handleClose={handleCloseAfiliado}
          open={afiliadoOpen}
          onImprimir={onImprimir}
          onVerAportes={onVerAportes}
        />
      )}

      {aportesOpen && (
        <AportesList
          open={aportesOpen}
          rows={aportes}
          handleClose={handleCloseAportes}
          loading={aportesLoading}
        />
      )}
    </>
  );
}