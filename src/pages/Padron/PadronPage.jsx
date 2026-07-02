import { Box, Stack } from "@mui/material";
import PadronesBar from "./Components/PadronesBar";
import PadronesList from "./Components/PadronesList";
import PadronModal from "./Components/PadronModal";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchAportes, printConsultaPadron } from "../../store/padrones/thunks";
import { PadronSucursal } from "./Components/PadronSucursal";
import { ChatBotContainer } from "../../components/chatBot";
// import äportesMock from "../../api/modelo.json";

export default function PadronPage() {

  const dispatch = useDispatch();
  const [modalType, setModalType] = useState(null);
  const [afiliadoSeleccionado, setAfiliadoSeleccionado] = useState(null);
  const [aportesSeleccionados, setAportesSeleccionados] = useState([]);

  const { afiliadoArr, aportes, loading } = useSelector((state) => state.padrones);

  const rows = useMemo(() => 
    Array.isArray(afiliadoArr)
    ? afiliadoArr.map((item, index) => ({ id: index, ...item }))
    : [afiliadoArr],
    );

  const handleInfoClick = useCallback((afiliado) => {
    setAfiliadoSeleccionado(afiliado);
    setModalType('afiliado');
  });

  const handlePrintConsulta = () => {
    dispatch(printConsultaPadron(afiliadoArr));
  }

  const handleClose = useCallback(() => {
    setAfiliadoSeleccionado(null);
    setAportesSeleccionados([]);
    setModalType(null);
  });

  const buscarAportes = (cuil) => {
    dispatch(fetchAportes(cuil));
    setModalType('aportes');
    // setAportesSeleccionados(aportes)
  }

  useEffect(() => {
    if (modalType === 'aportes' && aportes.length > 0) {
      setAportesSeleccionados(aportes);
    }
  },[aportes, modalType])

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
      alignItems: "stretch", // fuerza a que ambos hijos tomen el alto disponible
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <PadronesList
        rows={rows}
        loading={loading}
        onInfoClick={handleInfoClick}
        onPrintConsulta={handlePrintConsulta}
        fetchAportes={buscarAportes}
      />
    </Box>

    {/* sin width fijo: dejamos que ChatWindow controle su propio ancho */}
    <Box sx={{ flexShrink: 0 }}>
      <ChatBotContainer />
    </Box>
  </Stack>

  <PadronModal
    open={modalType}
    aportes={aportes}
    handleClose={handleClose}
    data={afiliadoSeleccionado}
    loading={loading}
    historial={afiliadoSeleccionado?.historial_coberturas || []}
  />
</Stack>
    </Box>
  );
}
