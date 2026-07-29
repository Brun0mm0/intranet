import { Box, Stack } from "@mui/material";
import PadronesBar from "./Components/PadronesBar";
import PadronesList from "./Components/PadronesList";
import PadronModal from "./Components/PadronModal";
import { PadronSucursal } from "./Components/PadronSucursal";
import { ChatBotContainer } from "../../components/chatBot";

import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useMemo } from "react";
import { fetchAportes, printConsultaPadron, fetchAfiliadoDetalle, fetchAfiliadoArr } from "../../store/padrones/thunks";
import { resetAfiliadoDetalle, resetAportes } from "../../store/padrones/padronSlice";
// import äportesMock from "../../api/modelo.json";

export default function PadronPage() {

  const dispatch = useDispatch();

  // ✅ Antes: un único `modalType` decidía cuál de los dos modales se
  // mostraba, así que abrir "Aportes" cerraba el modal de detalle del
  // afiliado. Ahora son dos flags independientes — pueden convivir abiertos
  // al mismo tiempo.
  const [afiliadoOpen, setAfiliadoOpen] = useState(false);
  const [aportesOpen, setAportesOpen] = useState(false);

  const {
    afiliadoArr,
    aportes,
    loading,
    afiliadoDetalle,
    detalleLoading,
    aportesLoading,
  } = useSelector((state) => state.padrones);

  // ✅ Se marca cada fila según el tipo de búsqueda que la originó:
  // uno a muchos (array real de la API) trae Cuil_titular ya sin el
  // código de parentesco; uno a uno (objeto único envuelto acá en un
  // array de 1) lo trae con los 2 dígitos de parentesco al final.
  const rows = useMemo(() =>
    Array.isArray(afiliadoArr)
      ? afiliadoArr.map((item, index) => ({ id: index, ...item, _esBusquedaUnica: false }))
      : afiliadoArr
        ? [{ id: 0, ...afiliadoArr, _esBusquedaUnica: true }]
        : [],
    [afiliadoArr]
  );

  // ✅ Se abre el modal ya (con loading adentro) y se dispara la consulta
  // uno a uno por CUIL para traer el detalle completo del afiliado.
  const handleInfoClick = useCallback((afiliado) => {
    setAfiliadoOpen(true);
    dispatch(fetchAfiliadoDetalle(afiliado.CUIL));
  }, [dispatch]);

  const handlePrintConsulta = (afiliado) => {
    dispatch(printConsultaPadron(afiliado));
  }

  const handleCloseAfiliado = useCallback(() => {
    setAfiliadoOpen(false);
    dispatch(resetAfiliadoDetalle());
  }, [dispatch]);

  // ✅ Ya no toca el modal de detalle del afiliado — pueden estar los dos
  // abiertos a la vez (Aportes se apila arriba).
  const buscarAportes = (cuil) => {
    dispatch(fetchAportes(cuil));
    setAportesOpen(true);
  }

  const handleCloseAportes = useCallback(() => {
    setAportesOpen(false);
    dispatch(resetAportes());
  }, [dispatch]);

  // ✅ "Ver grupo familiar" reemplaza los resultados de la tabla principal,
  // igual que una búsqueda nueva desde la barra de arriba — por eso
  // reutiliza el mismo thunk fetchAfiliadoArr en vez de duplicar lógica.
  // El recorte del código de parentesco ya se resolvió en RowActionsMenu
  // según si la fila viene de uno a uno o uno a muchos.
  const handleVerGrupoFamiliar = (nroAfil) => {
    setAfiliadoOpen(false);
    dispatch(resetAfiliadoDetalle());
    dispatch(fetchAfiliadoArr({
      param: 'nro_cobertura',
      value: `${nroAfil}`,
    }));
  };

  return (
    <Box
      component="section"
      id="padron-page"
      sx={{
        flexGrow: 1,
        display: "flex",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Stack spacing={2} sx={{ height: "100%" }}>
        <PadronesBar loading={loading} />
        <Stack
          direction="row"
          spacing={2}
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            alignItems: "stretch",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <PadronesList
              rows={rows}
              loading={loading}
              onInfoClick={handleInfoClick}
              onPrintConsulta={handlePrintConsulta}
              fetchAportes={buscarAportes}
              onVerGrupoFamiliar={handleVerGrupoFamiliar}
            />
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <ChatBotContainer />
          </Box>
        </Stack>

        <PadronModal
          afiliadoOpen={afiliadoOpen}
          data={afiliadoDetalle}
          detalleLoading={detalleLoading}
          historial={afiliadoDetalle?.historial_coberturas || []}
          handleCloseAfiliado={handleCloseAfiliado}
          onImprimir={handlePrintConsulta}
          onVerAportes={buscarAportes}

          aportesOpen={aportesOpen}
          aportes={aportes}
          aportesLoading={aportesLoading}
          handleCloseAportes={handleCloseAportes}
        />
      </Stack>
    </Box>
  );
}