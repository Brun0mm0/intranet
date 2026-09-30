import { Stack } from '@mui/material'
import PageContainer from '../../components/common/PageContainer'
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
    <PageContainer id="prestaciones-page">
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
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
    </PageContainer>
  )
}
