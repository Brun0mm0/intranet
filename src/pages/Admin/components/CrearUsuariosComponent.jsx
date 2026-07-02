import { FormControl, FormLabel, TextField, Select, MenuItem, Stack, Typography, Button, InputAdornment } from '@mui/material'
import useForm from '../../../hooks/useForm'
import { formatCuil } from '../../../utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNuevoUsuario } from '../../../store/admin/thunk'

export const CrearUsuariosComponent = () => {
    const dispatch = useDispatch()
    const {values,handleChange, resetForm} = useForm({Email:'',Cuil:'',Rol:2})
    const { loadingNuevoUsuario } = useSelector( state => state.administrador)

    const handleReset = (e) => {
        e.preventDefault()
        resetForm()
    }

    const handleCrearUsuario = async (e) => {
        e.preventDefault()
        try {
            await dispatch(fetchNuevoUsuario(values)).unwrap()
            resetForm() 
        } catch (err) {
            // El error ya se maneja en el thunk, no es necesario hacer nada aquí
        }
    }

  return (
    <form onSubmit={handleCrearUsuario}>
        <Stack spacing={1} sx={{width:'100%'}}>
        {/* Email */}
        <FormControl margin='dense'>
            <FormLabel>
                <Typography variant='subtitle1'>Email</Typography>
            </FormLabel>
           <TextField
                name="Email"
                value={values.Email}
                onChange={(e) => {
                    const username = e.target.value

                    handleChange({
                    target: {
                        name: 'Email',
                        value: username
                    }
                    })
                }}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        @osssb.com.ar
                    </InputAdornment>
                    )
                }}
            />
        </FormControl>
        {/* Cuil */}
        <FormControl margin='dense'>
            <FormLabel>
                <Typography variant='subtitle1'>Cuil</Typography>
            </FormLabel>
            <TextField
                name="Cuil"
                value={values.Cuil}
                onChange={(e) => {
                    const formatted = formatCuil(e.target.value)

                    handleChange({
                    target: {
                        name: 'Cuil',
                        value: formatted
                    }
                    })
                }}
                />
        </FormControl>
        {/* Rol */}
        <FormControl margin='normal'>
            <FormLabel>
                <Typography variant='subtitle1'>Rol</Typography>
            </FormLabel>
            <Select
                labelId="rol-label"
                label="Rol"
                name='Rol'
                value={values.Rol}
                onChange={handleChange}
            >
                <MenuItem value={1}>Administrador</MenuItem>
                <MenuItem value={2}>Usuario</MenuItem>
                <MenuItem value={3}>Recursos Humanos</MenuItem>
                <MenuItem value={4}>Empleado</MenuItem>
                <MenuItem value={5}>Afiliaciones</MenuItem>
                <MenuItem value={6}>Sucursales</MenuItem>
                <MenuItem value={7}>Prestaciones</MenuItem>
            </Select>
        </FormControl>
        </Stack>
        <Stack direction={'row-reverse'} spacing={3} marginTop={3}>
            <Button 
                loading={loadingNuevoUsuario}
                variant='outlined' 
                type='submit' 
                fullWidth 
                sx={{
                    marginTop:'2rem',
                    borderColor: '#009ada80',
                    bgcolor: '#41a5cf33',
                    '&:hover': { bgcolor: '#19a4df80' },
                }}
                    >
                <Typography variant='button'>Crear</Typography>
            </Button>
            <Button 
                variant='outlined' 
                fullWidth 
                type='reset'
                onClick={handleReset}
                sx={{
                    marginTop:'2rem'}}
                    >
                <Typography variant='button'>Reset</Typography>
            </Button>
        </Stack>
    </form>
  )
}


// 1	Administrador	Acceso completo al sistema
// 2	Usuario	Acceso básico para usuarios registrados
// 3	Recursos Humanos	Acceso para recursos humanos
// 4	Empleado	Acceso a padrón
// 5	Afiliaciones	Modulo afiliación
// 6	Sucursales	Modulo Sucursal