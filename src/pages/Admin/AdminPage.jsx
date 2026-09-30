import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Chip, CircularProgress, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsuarios, fetchActualizarRol } from '../../store/admin/thunk'
import { CrearUsuariosComponent } from './components/CrearUsuariosComponent'
import { ListaUsuariosComponent } from './components/ListaUsuariosComponent'
import { SearchInput } from '../../components/inputs/SearchInput'
import PageContainer from '../../components/common/PageContainer'
import { panelSx } from '../../shared-theme/customizations/intranetStyles'
import { MARINO } from '../../shared-theme/customizations/dataGrid'
import { ROLES } from './roles'

const BANNER_BG = 'linear-gradient(110deg, #0092c0 0%, #00a9da 45%, #02b57e 100%)'

export const AdminPage = () => {
  const dispatch = useDispatch()
  const { usuarios, loadingUsuarios } = useSelector(state => state.administrador)

  const [filaPendiente, setFilaPendiente] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [rolFiltro, setRolFiltro] = useState('todos')
  const [modalAbierto, setModalAbierto] = useState(false)

  // ✅ Antes había que apretar "Ver usuarios"; ahora la lista se carga al entrar
  useEffect(() => {
    dispatch(fetchUsuarios())
  }, [dispatch])

  const conteoRoles = useMemo(() => {
    const conteo = {}
    usuarios.forEach(u => { const id = Number(u.rol_id); conteo[id] = (conteo[id] ?? 0) + 1 })
    return conteo
  }, [usuarios])

  // Busca por usuario, email o CUIL (el CUIL también sin guiones)
  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    const digitos = texto.replace(/\D/g, '')
    return usuarios.filter(u => {
      if (rolFiltro !== 'todos' && Number(u.rol_id) !== rolFiltro) return false
      if (!texto) return true
      return (
        u.NombreUsuario?.toLowerCase().includes(texto) ||
        u.Email?.toLowerCase().includes(texto) ||
        u.cuil?.toLowerCase().includes(texto) ||
        (digitos.length > 2 && u.cuil?.replace(/\D/g, '').includes(digitos))
      )
    })
  }, [usuarios, busqueda, rolFiltro])

  const handleCambiarRolUsuario = async (usuario, nuevoRolId) => {
    setFilaPendiente(usuario.id)
    try {
      await dispatch(fetchActualizarRol({ usuario, rolId: nuevoRolId })).unwrap()
      await dispatch(fetchUsuarios()).unwrap() // Refrescar la lista después de actualizar el rol
    } catch {
      // El error ya se maneja en el thunk (notificación)
    } finally {
      setFilaPendiente(null)
    }
  }

  const filtros = [
    { value: 'todos', label: 'Todos', cantidad: usuarios.length },
    ...Object.keys(ROLES).map(Number).filter(id => conteoRoles[id]).map(id => ({ value: id, label: ROLES[id].label, cantidad: conteoRoles[id] })),
  ]

  return (
    <PageContainer>
      {/* Barra con el degradado del banner: búsqueda + alta de usuario */}
      <Box
        sx={{
          backgroundImage: BANNER_BG,
          borderRadius: 3,
          px: 2.5,
          py: 1.5,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          flexWrap: 'wrap',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
          <AdminPanelSettingsRoundedIcon />
          <Typography variant="h6" fontWeight={700} color="inherit" noWrap>
            Usuarios
          </Typography>
        </Stack>

        <Box flex={1} minWidth={260} maxWidth={480}>
          <SearchInput
            name="busqueda-usuarios"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por usuario, email o CUIL"
            sx={{ width: '100%', bgcolor: '#fff', borderRadius: 2, pr: 0 }}
          />
        </Box>

        <Button
          startIcon={<PersonAddAlt1RoundedIcon />}
          onClick={() => setModalAbierto(true)}
          sx={{
            ml: 'auto',
            bgcolor: '#fff',
            color: '#0079a0',
            fontWeight: 700,
            textTransform: 'none',
            px: 2.5,
            border: 0,
            '&:hover': { bgcolor: '#eaf7fc' },
          }}
        >
          Nuevo usuario
        </Button>
      </Box>

      <Box sx={{ ...panelSx, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {usuarios.length > 0 && (
          <Stack direction="row" alignItems="center" spacing={1} px={2} py={1.25} borderBottom={1} borderColor="#e1e8eb" flexWrap="wrap" useFlexGap>
            {filtros.map((f) => {
              const activo = rolFiltro === f.value
              return (
                <Chip
                  key={f.value}
                  label={`${f.label} ${f.cantidad}`}
                  onClick={() => setRolFiltro(f.value)}
                  variant={activo ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 700, ...(activo && { bgcolor: MARINO, '& .MuiChip-label': { color: '#fff' }, '&:hover': { bgcolor: MARINO } }) }}
                />
              )
            })}
          </Stack>
        )}

        {loadingUsuarios && usuarios.length === 0 ? (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : usuariosFiltrados.length === 0 ? (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={4}>
            <Typography color="text.secondary" textAlign="center">
              {usuarios.length === 0 ? 'No hay usuarios para mostrar.' : 'Ningún usuario coincide con la búsqueda.'}
            </Typography>
          </Box>
        ) : (
          <ListaUsuariosComponent
            usuarios={usuariosFiltrados}
            onCambioRol={handleCambiarRolUsuario}
            filaPendiente={filaPendiente}
          />
        )}
      </Box>

      <Dialog
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}
      >
        <Box sx={{ backgroundImage: BANNER_BG, color: '#fff', px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} color="inherit">Nuevo usuario</Typography>
          <IconButton onClick={() => setModalAbierto(false)} aria-label="Cerrar" sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ pt: '20px !important' }}>
          <CrearUsuariosComponent onCreado={() => setModalAbierto(false)} onCancelar={() => setModalAbierto(false)} />
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
