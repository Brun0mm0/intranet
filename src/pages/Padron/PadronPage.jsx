import { Box, Stack } from "@mui/material";
import PageContainer from "../../components/common/PageContainer";
import PadronesBar from "./Components/PadronesBar";
import PadronesList from "./Components/PadronesList";
import PadronModal from "./Components/PadronModal";
import { PadronSucursal } from "./Components/PadronSucursal";
import { ChatBotContainer } from "../../components/chatBot";
import { RowActionsMenu } from "./Columns/Rowactionsmenu";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useMemo } from "react";
import { fetchAportes, printConsultaPadron, fetchAfiliadoDetalle, fetchAfiliadoArr } from "../../store/padrones/thunks";
import { resetAfiliadoDetalle, resetAportes, resetFiltroSecundario } from "../../store/padrones/padronSlice";

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
    ultimoParametroBusqueda,
    filtroSecundario,
    filtroSecundarioCampo,
  } = useSelector((state) => state.padrones);

  // ✅ Se marca cada fila según el tipo de búsqueda que la originó:
  // uno a muchos (array real de la API) trae Cuil_titular ya sin el
  // código de parentesco; uno a uno (objeto único envuelto acá en un
  // array de 1) lo trae con los 2 dígitos de parentesco al final.
  //
  // ✅ Caso puntual: la búsqueda por nro_cobertura (grupo familiar) viene
  // con Cuil_titular en null para TODOS los integrantes — es un problema
  // de datos del backend específico de esa búsqueda (el resto, dni,
  // apellido, etc., lo trae bien). Como fallback, cuando la última
  // búsqueda fue por nro_cobertura, se busca dentro del mismo array al
  // integrante marcado como "Titular" y se usa su propio CUIL para
  // completar Cuil_titular en las filas que lo tengan null.
  //
  // ✅ Filtro secundario: búsqueda combinada "apellido,nombre" (ej:
  // "pr,br"). No pega al backend de nuevo — filtra sobre lo que ya
  // trajo afiliadoArr, por el campo complementario.
  const rows = useMemo(() => {
    let built;

    if (!Array.isArray(afiliadoArr)) {
      built = afiliadoArr ? [{ id: 0, ...afiliadoArr, _esBusquedaUnica: true }] : [];
    } else {
      const esGrupoFamiliar = ultimoParametroBusqueda === 'nro_cobertura';
      // ✅ Antes buscaba por Parentesco === 'Titular', pero ese campo viene
      // null en esta búsqueda puntual. El código de parentesco (Parentesco_cod)
      // sí viene siempre — "S" es el código de Titular.
      const titular = esGrupoFamiliar
        ? afiliadoArr.find((item) => item.Parentesco_cod === 'S')
        : null;

      built = afiliadoArr.map((item, index) => ({
        id: index,
        ...item,
        Cuil_titular: item.Cuil_titular ?? (esGrupoFamiliar ? titular?.CUIL ?? null : item.Cuil_titular),
        _esBusquedaUnica: false,
      }));
    }

    if (!filtroSecundario || !filtroSecundarioCampo) {
      return built;
    }

    // ✅ Antes: startsWith sobre el string completo — un afiliado con
    // "JUAN CARLOS" como Nombre nunca matcheaba si escribías "carlos"
    // (no estaba al principio del string). Ahora se parte el campo en
    // palabras y alcanza con que UNA de ellas empiece con el término.
    const termino = filtroSecundario.toLowerCase();
    return built.filter((row) => {
      const valorCampo = (row[filtroSecundarioCampo] ?? "").toString().toLowerCase();
      return valorCampo
        .split(/\s+/)
        .some((palabra) => palabra.startsWith(termino));
    });
  }, [afiliadoArr, ultimoParametroBusqueda, filtroSecundario, filtroSecundarioCampo]);

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
    dispatch(resetFiltroSecundario());
    dispatch(fetchAfiliadoArr({
      param: 'nro_cobertura',
      value: `${nroAfil}`,
    }));
  };

  return (
    <PageContainer id="padron-page" title="Padrón">
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
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

          {/* <Box sx={{ flexShrink: 0 }}>
            <ChatBotContainer />
          </Box> */}
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
    </PageContainer>
  );
}