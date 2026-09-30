import { useState } from 'react'
import { CrearUsuariosComponent } from './components/CrearUsuariosComponent'
import { Box, Typography, Stack, Button, List, CircularProgress, TextField, InputAdornment } from '@mui/material'
import { fetchUsuarios, fetchActualizarRol } from '../../store/admin/thunk'
import { useDispatch, useSelector } from 'react-redux'
import { ListaUsuariosComponent } from './components/ListaUsuariosComponent'
import SearchIcon from '@mui/icons-material/Search';
import PageContainer from '../../components/common/PageContainer'
import { accionButtonSx, panelSx } from '../../shared-theme/customizations/intranetStyles'

export const AdminPage = () => {
  
  const dispatch = useDispatch()
  
  const { usuarios, loadingUsuarios } = useSelector(state => state.administrador)

  const [listaVisible, setListaVisible] = useState(false)
  const [filaPendiente, setFilaPendiente] = useState(null)
  const [filtroNombre, setFiltroNombre] = useState('')
  
  const handleVerUsuarios = async () => {
    try {
      await dispatch(fetchUsuarios()).unwrap()
      setListaVisible(true)
    } catch (err) {
      // El error ya se maneja en el thunk, no es necesario hacer nada aquí
    }
  }

  const usuariosFiltrados = usuarios.filter(usuario =>
  [
    usuario.NombreUsuario,
    usuario.cuil
  ]
    .some(campo => campo?.toLowerCase().includes(filtroNombre.toLowerCase()))
  )

  const handleCambiarRolUsuario = async (usuario, nuevoRolId) => {
    setFilaPendiente(usuario.id)
    try {
        await dispatch(fetchActualizarRol({ usuario, rolId: nuevoRolId })).unwrap()
        await dispatch(fetchUsuarios()).unwrap() // Refrescar la lista de usuarios después de actualizar el rol
    } finally {
        setFilaPendiente(null)
    }
  }
  
  return (
    <PageContainer title="Administración">
      <Box sx={{ display:'flex', flex:1, minHeight:0, flexDirection:{ xs:'column', md:'row'}, gap:2 }}>
      <Stack flex={1} minHeight={0} padding={2} sx={panelSx}>
        <Typography variant='h5'>Lista de usuarios</Typography>
        { !listaVisible && (
        <Button 
          variant='outlined' 
          onClick={handleVerUsuarios} 
          startIcon={loadingUsuarios && <CircularProgress size={14} thickness={5} />}
          sx={{
                marginTop:'2rem',
                ...accionButtonSx,
            }} 
          disabled={listaVisible}>
           {loadingUsuarios ? 'Cargando...' : 'Ver usuarios'}
        </Button>
        )
        }
        { listaVisible && (
          <Stack flex={1} minHeight={0}>
            <TextField
              size="small"
              placeholder="Buscar por nombre de usuario..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              sx={{ marginBottom: 1 }}
              InputProps={{
              startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
              ),
            }}
          />
          <ListaUsuariosComponent 
            usuarios={usuariosFiltrados} 
            onCambioRol={handleCambiarRolUsuario}
            filaPendiente={filaPendiente}
            />
        </Stack>
        )
        }
      </Stack>
      <Stack flex={.3} sx={panelSx} padding={2}>
        <Typography variant='h5'>Crear usuarios</Typography>
        <CrearUsuariosComponent />
      </Stack>
      </Box>
    </PageContainer>
  )
}
