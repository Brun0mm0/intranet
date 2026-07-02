import { Button, Stack, Typography, Divider } from '@mui/material';
import useForm from "../../../../hooks/useForm"
import { SearchInput } from '../../../../components/inputs/SearchInput';
import { useDispatch } from 'react-redux';
import { ListadoDomicilioExplotacion } from './ListadoDomicilioExplotacion';

export const FormularioListarDomicilioExplotacionComponent = ({fetchFormulario, listado = [], loading = false}) => {
  
  const { values, handleChange } = useForm({cuit:''})
  const dispatch = useDispatch()

  const handleFetchForm = async () => {
    await dispatch(fetchFormulario(values.cuit))
  }
  
  return (
    <>
      <Stack 
        sx={{
          display: 'flex', 
          justifyContent: 'space-between', 
          flexDirection: 'row', 
          alignItems: 'center', 
          width: '100%',
          paddingLeft: 1,
          borderRadius: 1
          }}> 
        <Typography variant="subtitle1">Ingrese un número de CUIT</Typography>
        <Stack direction={'row'} spacing={1} >
          <SearchInput name={'cuit'} value={values.cuit} onChange={handleChange}/>
          <Button loading={loading} variant='outlined' onClick={handleFetchForm}>Enviar</Button>
        </Stack>   
      </Stack>
      <Divider sx={{my:1}}/>
      {
        <ListadoDomicilioExplotacion rows={listado} loading={loading} />
      }
    </>
    // <div>FormularioListarDomicilioExplotacion</div>
  )
}
