import { Box, Stack, Typography } from "@mui/material";
import { motion, AnimatePresence } from 'motion/react';
import { FormularioProcesarArchivoComponent } from "../common/FormularioProcesarArchivoComponent.jsx";
import ErrorBoundary from '../../../../components/common/ErrorBoundary.jsx';


export const DomicilioExplotacionComponent = ({                 
  fetchUpdate,
  loadingUpdate,
}) => {
  
  return (
    <AnimatePresence>
    <Box sx={{ width: "100%" }} display="flex" flexDirection={"column"} bgcolor="#f5f5f5" borderRadius={1} border={1} borderColor={'#d5d5d5'} p={1} px={2} gap={0}>
        <Stack display={"flex"} flexDirection={"row"} pb={1} justifyContent="space-between" alignItems="center" gap={1}>
          <Typography variant='subtitle1'>Domicilio de Explotación</Typography>
        </Stack>
        <ErrorBoundary>
          <FormularioProcesarArchivoComponent loading={loadingUpdate} fetchFuncion={fetchUpdate} tipoArchivo={'Domicilios_Explotacion'} />
        </ErrorBoundary>

    </Box>
    </AnimatePresence>
  );
};
