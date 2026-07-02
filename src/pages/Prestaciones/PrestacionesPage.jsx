import { Box, Stack } from '@mui/material'
import { PrestacionesBar } from './componentes/PrestacionesBar'
import { useDispatch, useSelector } from 'react-redux'
import { PrestacionesTabla } from './componentes/PrestacionesTabla'
import { resetState } from '../../store/prestaciones/prestacionesSlice'
import { useEffect, useState } from 'react'


export const PrestacionesPage = () => {
  const dispatch = useDispatch(); 

  const [activeParam, setActiveParam] = useState("cuit");

  useEffect(() => {
    return () => {
      dispatch(resetState());
    }}, [dispatch]);
    
    
  const { loading, error, facturas, proveedor } = useSelector((state) => state.prestaciones);


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
        <PrestacionesBar 
          loading={loading} 
          errorText={error}
          onSearchParamChange={setActiveParam}
          />
        <PrestacionesTabla 
          rows={facturas} 
          loading={loading} 
          proveedor={proveedor}
          searchParam={activeParam}
          />
      </Stack>
    </Box>
  )
}
