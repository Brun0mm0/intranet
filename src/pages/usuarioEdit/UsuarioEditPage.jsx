import { useState } from 'react'
import { FormControl, FormLabel, TextField, Stack, Typography, Button, IconButton, InputAdornment, Box } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useDispatch } from 'react-redux'
import useForm from '../../hooks/useForm'
import intranetApi from '../../api/intranetApi'
import { showNotification } from '../../store/notification/notificationSlice'

export const UsuarioEditPage = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showNueva, setShowNueva] = useState(false);
    const [showConfirmacion, setShowConfirmacion] = useState(false);
    const { values, errors, handleChange, setError, resetForm } = useForm({ nueva: '', confirmacion: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!values.nueva || !values.confirmacion) {
            dispatch(showNotification({ message: 'Completá todos los campos', type: 'error' }));
            return;
        }

        if (values.nueva !== values.confirmacion) {
            setError('confirmacion', 'Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            await intranetApi.put('/cambiarclave/', {
                contrasena: values.nueva,
            });
            dispatch(showNotification({ message: 'Contraseña actualizada correctamente', type: 'success' }));
            resetForm();
        } catch (err) {
            const message = err.response?.data?.message || 'No se pudo actualizar la contraseña';
            dispatch(showNotification({ message, type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
                    }}
                    width="100%"
                    height="100%"
                    borderRadius={2}
                    p={2}
                    display="flex"
                    gap={2}
                    flexDirection="column"
                    alignItems="center">
        <Typography width={'100%'} variant='h3' align='left'>Cambio de Contraseña</Typography>
        <Box flexGrow={1} width="100%" display="flex" alignItems="center" justifyContent="center">
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack spacing={1} border={1} borderColor={"#dad9d9"} py={3} borderRadius={2} sx={{ maxWidth: 600, padding: 3, margin: "auto", backgroundColor: "#fff" }}>
                <FormControl margin='dense'>
                    <FormLabel><Typography variant='subtitle1'>Nueva contraseña</Typography></FormLabel>
                    <TextField
                        name="nueva"
                        type={showNueva ? 'text' : 'password'}
                        value={values.nueva}
                        onChange={handleChange}
                        autoComplete="new-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showNueva ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        onClick={() => setShowNueva((prev) => !prev)}
                                        edge="end"
                                        size="small"
                                        sx={{ border: 'none', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'action.hover' } }}
                                    >
                                        {showNueva ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormControl>
                <FormControl margin='dense'>
                    <FormLabel><Typography variant='subtitle1'>Confirmar nueva contraseña</Typography></FormLabel>
                    <TextField
                        name="confirmacion"
                        type={showConfirmacion ? 'text' : 'password'}
                        value={values.confirmacion}
                        onChange={handleChange}
                        error={!!errors.confirmacion}
                        helperText={errors.confirmacion}
                        autoComplete="new-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showConfirmacion ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        onClick={() => setShowConfirmacion((prev) => !prev)}
                                        edge="end"
                                        size="small"
                                        sx={{ border: 'none', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'action.hover' } }}
                                    >
                                        {showConfirmacion ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormControl>
            <Stack direction='row' justifyContent={'center'} spacing={3} pt={6} width="100%">
                <Button
                    loading={loading}
                    variant='outlined'
                    type='submit'
                    sx={{
                        minWidth: 240,
                        borderColor: '#009ada80',
                        bgcolor: '#41a5cf33',
                        '&:hover': { bgcolor: '#19a4df80' },
                    }}
                    >
                    <Typography variant='button'>Cambiar contraseña</Typography>
                </Button>
            </Stack>
            </Stack>
        </form>
        </Box>
    </Box>
    )
}
