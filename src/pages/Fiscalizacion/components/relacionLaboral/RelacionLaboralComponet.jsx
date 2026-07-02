import { Box, Stack, Divider } from "@mui/material";
import { ListaRelacionLaboralComponent } from "./ListaRelacionLaboralComponent.jsx";
import { motion, AnimatePresence } from 'motion/react';
import { FormularioProcesarArchivoComponent } from "../common/FormularioProcesarArchivoComponent.jsx";
import { FormularioListarDomicilioExplotacionComponent } from "./FormularioListarDomicilioExplotacion.jsx";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "../../../../components/common/ErrorBoundary.jsx";
import { fetchRelacionLaboralUpload, fetchListaArchivosProcesados, fetchListaDomicilioExplotacion } from "../../../../store/fiscalizacion/thunks.js";
import { useEffect } from "react";
import { ToggleEstadosWrapper } from "../../../../components/ToggleEstadosWrapper.jsx"
export const RelacionLaboralComponent = () => {

  const dispatch = useDispatch()
  const {
      envioRelacionesLaborales,
      listadoArchivosRecientes,
      listadoRelacionesLaborales
    } = useSelector((state) => state.fiscalizacion)

  const fetchEnvioRelalcionesLaboralesTxt = (e) => {
     dispatch(fetchRelacionLaboralUpload(e))
  }

  useEffect(()=> {
    dispatch(fetchListaArchivosProcesados())
  },[])

  return (
    <AnimatePresence>
      <ErrorBoundary>
        <Box sx={{ width: "100%" }} display="flex" flexDirection={"column"} gap={2}>
             <Stack bgcolor="#f5f5f5" borderRadius={1} border={1} borderColor={'#d5d5d5'} p={1} px={2}>
              <FormularioProcesarArchivoComponent 
                      loading={envioRelacionesLaborales.loading} 
                      fetchFuncion={fetchEnvioRelalcionesLaboralesTxt} 
                      tipoArchivo={'Relaciones_Laborales'} />
              <Stack py={1}>
                <Divider></Divider>
              </Stack>
            <Stack sx={{backgroundColor:'#fdf5deff', borderRadius:1, border:1, borderColor:'#ded3b4ff'}}>
              <ToggleEstadosWrapper title="Últimos archivos procesados">
                <ListaRelacionLaboralComponent vista={listadoArchivosRecientes.data} loading={listadoArchivosRecientes.loading}/>
              </ToggleEstadosWrapper>
                </Stack> 
              </Stack>
             <Stack bgcolor="#f5f5f5" borderRadius={1} border={1} borderColor={'#d5d5d5'} p={1}>
              {/* <ToggleEstadosWrapper title="Listado de Domicilios de Explotación"> */}
              <FormularioListarDomicilioExplotacionComponent fetchFormulario={fetchListaDomicilioExplotacion} listado={listadoRelacionesLaborales.data} loading={listadoRelacionesLaborales.loading}/>
              {/* </ToggleEstadosWrapper> */}
              </Stack>
        </Box>
      </ErrorBoundary>
    </AnimatePresence>
  );
};
