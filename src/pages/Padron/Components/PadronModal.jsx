import { AfiliadoView } from "./AfiliadoView";

// ✅ Un solo modal: el detalle del afiliado con pestañas. Aportes antes se abría
// en un segundo modal apilado encima; ahora es la pestaña "Aportes".
export default function PadronModal({
  afiliadoOpen,
  data,
  detalleLoading,
  historial,
  handleCloseAfiliado,
  onImprimir,
  tab,
  onTabChange,
  aportes,
  aportesLoading,
}) {
  if (!afiliadoOpen) return null;

  return (
    <AfiliadoView
      open={afiliadoOpen}
      data={data}
      loading={detalleLoading}
      historial={historial}
      handleClose={handleCloseAfiliado}
      onImprimir={onImprimir}
      tab={tab}
      onTabChange={onTabChange}
      aportes={aportes}
      aportesLoading={aportesLoading}
    />
  );
}
