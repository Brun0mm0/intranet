import { Box, FormControl, FormLabel, TextField, Select, MenuItem, Stack, Typography, Button, InputAdornment } from '@mui/material'
import useForm from '../../../hooks/useForm'
import { formatCuil } from '../../../utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNuevoUsuario } from '../../../store/admin/thunk'
import { MARINO } from '../../../shared-theme/customizations/dataGrid'
import { ROLES, ROLES_IDS } from '../roles'

const labelSx = { fontSize: '0.8rem', fontWeight: 700, color: '#33434a', mb: 0.5 }

// 🔹 Formulario de alta de usuario (se muestra dentro del modal "Nuevo usuario").
// onCreado: se llama después de crear bien el usuario · onCancelar: cierra sin crear.
export const CrearUsuariosComponent = ({ onCreado, onCancelar }) => {
    const dispatch = useDispatch()
    const { values, handleChange, resetForm } = useForm({ Email: '', Cuil: '', Rol: 2 })
    const { loadingNuevoUsuario } = useSelector(state => state.administrador)

    const cuilCompleto = values.Cuil.replace(/\D/g, '').length === 11
    const listo = values.Email.trim() && cuilCompleto

    const handleCancelar = () => {
        resetForm()
        onCancelar?.()
    }

    const handleCrearUsuario = async (e) => {
        e.preventDefault()
        if (!listo) return
        try {
            await dispatch(fetchNuevoUsuario(values)).unwrap()
            resetForm()
            onCreado?.()
        } catch {
            // El error ya se maneja en el thunk (notificación)
        }
    }

    return (
        <form onSubmit={handleCrearUsuario}>
            <Stack spacing={2}>
                <FormControl>
                    <FormLabel htmlFor="nuevo-usuario" sx={labelSx}>Usuario</FormLabel>
                    <TextField
                        id="nuevo-usuario"
                        name="Email"
                        size="small"
                        placeholder="nombre.apellido"
                        value={values.Email}
                        // Solo el nombre de usuario: el dominio se agrega solo
                        onChange={(e) => handleChange({ target: { name: 'Email', value: e.target.value.replace(/@.*$/, '').trim() } })}
                        autoFocus
                        InputProps={{ endAdornment: <InputAdornment position="end">@osssb.com.ar</InputAdornment> }}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="nuevo-cuil" sx={labelSx}>CUIL</FormLabel>
                    <TextField
                        id="nuevo-cuil"
                        name="Cuil"
                        size="small"
                        placeholder="20-12345678-9"
                        value={values.Cuil}
                        onChange={(e) => handleChange({ target: { name: 'Cuil', value: formatCuil(e.target.value) } })}
                        inputProps={{ inputMode: 'numeric' }}
                        helperText={values.Cuil && !cuilCompleto ? 'El CUIL tiene 11 dígitos.' : ' '}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="nuevo-rol" sx={labelSx}>Rol</FormLabel>
                    <Select id="nuevo-rol" name="Rol" size="small" value={values.Rol} onChange={handleChange}>
                        {ROLES_IDS.map((id) => (
                            <MenuItem key={id} value={id} sx={{ gap: 1 }}>
                                <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: ROLES[id].color }} />
                                {ROLES[id].label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography variant="caption" color="text.secondary" mt={0.5}>
                        {ROLES[values.Rol]?.desc}
                    </Typography>
                </FormControl>

                <Stack direction="row" justifyContent="flex-end" spacing={1} pt={1}>
                    <Button variant="outlined" onClick={handleCancelar} sx={{ textTransform: 'none', fontWeight: 700 }}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        loading={loadingNuevoUsuario}
                        disabled={!listo}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 2.5,
                            bgcolor: MARINO,
                            color: '#fff',
                            border: 0,
                            '&:hover': { bgcolor: '#082c3b' },
                            '&.Mui-disabled': { bgcolor: 'rgba(11,59,79,0.35)', color: 'rgba(255,255,255,0.8)' },
                        }}
                    >
                        Crear usuario
                    </Button>
                </Stack>
            </Stack>
        </form>
    )
}
