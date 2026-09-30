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
import { CAMPO_APELLIDO_NOMBRE } from "./hooks/Usebusquedaautomatica";

export default function PadronPage() {

  const dispatch = useDispatch();

  // ✅ Un solo modal de detalle con pestañas (Datos / Historial / Aportes).
  // `aportesCuil` recuerda de qué CUIL están cargados los aportes, para no
  // volver a pedirlos cada vez que se cambia de pestaña.
  const [afiliadoOpen, setAfiliadoOpen] = useState(false);
  const [tab, setTab] = useState("datos");
  const [aportesCuil, setAportesCuil] = useState(null);

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

    // ✅ Se parte el texto en palabras y cada término tiene que ser el comienzo
    // de alguna palabra. Con CAMPO_APELLIDO_NOMBRE ("peña luis", "gomez peralta")
    // se busca en apellido y nombre juntos y tienen que coincidir todos los términos.
    // Se comparan sin acentos y en minúsculas.
    const sinAcentos = (t) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    const terminos = sinAcentos(filtroSecundario).split(/\s+/).filter(Boolean);
    return built.filter((row) => {
      const texto = filtroSecundarioCampo === CAMPO_APELLIDO_NOMBRE
        ? `${row.Apellido ?? ""} ${row.Nombre ?? ""}`
        : (row[filtroSecundarioCampo] ?? "").toString();
      const palabras = sinAcentos(texto).split(/\s+/);
      return terminos.every((t) => palabras.some((palabra) => palabra.startsWith(t)));
    });
  }, [afiliadoArr, ultimoParametroBusqueda, filtroSecundario, filtroSecundarioCampo]);

  const cargarAportes = useCallback((cuil) => {
    if (!cuil || cuil === aportesCuil) return;
    setAportesCuil(cuil);
    dispatch(fetchAportes(cuil));
  }, [aportesCuil, dispatch]);

  // ✅ Se abre el modal ya (con loading adentro) y se dispara la consulta
  // uno a uno por CUIL para traer el detalle completo del afiliado.
  const abrirDetalle = useCallback((afiliado, pestaña = "datos") => {
    dispatch(resetAportes());
    setAportesCuil(null);
    setTab(pestaña);
    setAfiliadoOpen(true);
    dispatch(fetchAfiliadoDetalle(afiliado.CUIL));
  }, [dispatch]);

  const handleInfoClick = useCallback((afiliado) => abrirDetalle(afiliado), [abrirDetalle]);

  // Desde la fila, "Aportes" abre el detalle directo en esa pestaña.
  // ✅ El CUIL no lleva ningún código pegado al final — se usa tal cual viene del backend.
  const handleAportesClick = useCallback((afiliado) => {
    abrirDetalle(afiliado, "aportes");
    setAportesCuil(afiliado.Cuil_titular);
    dispatch(fetchAportes(afiliado.Cuil_titular));
  }, [abrirDetalle, dispatch]);

  const handleTabChange = (nuevaTab) => {
    setTab(nuevaTab);
    if (nuevaTab === "aportes") {
      cargarAportes(afiliadoDetalle?.Cuil_titular ?? afiliadoDetalle?.CUIL);
    }
  };

  const handlePrintConsulta = (afiliado) => {
    dispatch(printConsultaPadron(afiliado));
  }

  const handleCloseAfiliado = useCallback(() => {
    setAfiliadoOpen(false);
    setAportesCuil(null);
    dispatch(resetAfiliadoDetalle());
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
    <PageContainer id="padron-page">
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
              fetchAportes={handleAportesClick}
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
          tab={tab}
          onTabChange={handleTabChange}
          aportes={aportes}
          aportesLoading={aportesLoading}
        />
      </Stack>
    </PageContainer>
  );
}