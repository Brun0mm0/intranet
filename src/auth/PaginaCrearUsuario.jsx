import { Box, Button, OutlinedInput, Stack, TextField, Typography, Link } from '@mui/material';
import useForm from '../hooks/useForm';

export default function PaginaCrearUsuario() {
    const {values,handleChange,errors,setError,resetForm} = useForm({Cuil:'',Email:'',Usuario:'',Rol:''})
  return (
    <Box sx={{ backgroundImage:"linear-gradient(345deg, rgba(0,169,218,.5) 0%, rgba(175,218,237,0.3) 25%, rgba(175,218,237,0.3) 75%, rgba(2,181,126,.5) 100%)"}} 
      height="100vh" 
      display="flex" 
      justifyContent="center" 
      alignItems="center">
        <Stack sx={{bgcolor:'#ffffff', padding:'32px', borderRadius:1, boxShadow:3}} >
            <Stack>
                <img src="/logo.png" alt="Logo" />
            </Stack>
            <Typography variant='h6' align='center' sx={{marginY:"32px"}}>Generar nuevo usuario</Typography>
            <Typography variant='body1' sx={{marginBottom:"16px"}}>Ingrese sus datos y genere su usuario.</Typography>
            <TextField 
                margin='normal' 
                label="Cuil"
                placeholder='Ingresá tu número de cuil'
                type='text'
                name='Cuil'
                onChange={handleChange}
                value={values.Cuil}
                />
            <TextField 
                margin='normal' 
                label="Email"
                placeholder='Email'
                type='email'
                name='Email'
                onChange={handleChange}
                value={values.Email}
                />
            <TextField 
                margin='normal' 
                label="Usuario" 
                placeholder='Ingresa un nombre de usuario'
                type='text'
                name='Usuario'
                onChange={handleChange}
                value={values.Usuario}
                />
            <Button variant='contained' sx={{marginTop:'32px'}}>
                Enviar Formulario
            </Button>
            <Link align='center' variant={'body2'} sx={{marginTop:'32px'}} href="/login">
                Volver al Login
            </Link>
        </Stack>
    </Box>
  )
}
