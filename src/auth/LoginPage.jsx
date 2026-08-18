import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import {SignInPage} from '@toolpad/core/SignInPage'
import {AppProvider} from '@toolpad/core/AppProvider'
import { Box, Button, CircularProgress, Typography, Link, Stack } from '@mui/material';
import {createTheme} from '@mui/material/styles';
import { ChatBotContainer } from '../components/chatBot/ChatBotContainer';

function titleCustom() {
  return (
    <Box display={"flex"} flexDirection="column" alignItems="center" mb={2}>
      <img src="/logo.png" alt="Logo Bancario" />
      <Typography  textTransform={'uppercase'} variant='h6' mt={2} >Intranet</Typography>
    </Box> 
    );
}
function subtitleCustom() {
  return <Typography pb={2} variant='subtitle2'>Por favor ingrese su usuario y contraseña</Typography>;
}
function loginButton(props) {
  return (
    <Button 
        {...props}
        variant="contained" 
        color="primary" 
        type="submit" 
        sx={{marginTop:4}} 
        fullWidth>
      Iniciar Sesión
    </Button>
  );
}
function crearUsuario() {
  return (
    <Stack marginTop={"32px"}>
      <Link href="/signin" variant="body2" align='center'>
        Crea tu Usuario
      </Link>
    </Stack>
  )
}

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function LoginPage() {
  const { login, logout, loading } = useAuth();
  const navigate = useNavigate();

  const providers = [{id: 'credentials', name: 'Correo y Contraseña'}];

  const handleSignIn = async (provider, formData) => {
    if(provider.id === 'credentials') {
      try {
        const usuario = formData.get('email')?.toString().trim();
        const password = formData.get('password')?.toString().trim();
        await login({usuario:usuario,password:password});
          // await login({usuario:usuario,password:80047707});
        // bruno.provenzano brun0330
        navigate('/padrones');
        return
      } catch (error) {
        alert("Error inicio de sesión")
      };
  };};

	80118563

  return (
    <Box 
      sx={{ backgroundImage:"linear-gradient(345deg, rgba(0,169,218,.5) 0%, rgba(175,218,237,0.3) 25%, rgba(175,218,237,0.3) 75%, rgba(2,181,126,.5) 100%)"}} 
      height="100vh" 
      display="flex" 
      justifyContent="center" 
      alignItems="center">
    <AppProvider theme={lightTheme}>
      <SignInPage
        slots={{
          title: titleCustom,
          subtitle: subtitleCustom,
          submitButton: loginButton,
          // typeof: 'text'
          // signUpLink: crearUsuario
        }}
        slotProps={{
        emailField: {
          label: 'Usuario',
          placeholder: 'Ingrese su usuario',
          type: 'text',
        }
        }}
        providers={providers}
        signIn={handleSignIn}
        // disableSignUp
        themeMode="light"
        // onLogout={handleLogout}
        />
    </AppProvider>
        {/* <ChatBotContainer/> */}
        </Box> 
);
}