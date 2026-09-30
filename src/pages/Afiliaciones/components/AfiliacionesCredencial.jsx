import { Box, Stack, Typography, TextField, Button, CircularProgress } from "@mui/material"
import useForm from "../../../hooks/useForm"
import { useDispatch, useSelector } from "react-redux";
import { fetchCredenciales } from "../../../store/afiliaciones/thunks";
import { SearchInput } from "../../../components/inputs/SearchInput";
import { accionButtonSx, panelSx } from "../../../shared-theme/customizations/intranetStyles";

export const AfiliacionesCredencial = () => {

    const { loading, error } = useSelector(state => state.afiliaciones);

    const dispatch = useDispatch();
    const {values, handleChange, resetForm, setError, errors} = useForm({
        dni: ''
    });

    function validateDNI(dni) {
        if (!dni) {
            return "El DNI es obligatorio.";
        }
        const dniPattern = /^\d{3,8}$/; // Asegura que el DNI tenga exactamente 8 dígitos
        if (!dniPattern.test(dni)) {
            return "Hay un error en el formato del DNI";
        }
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateDNI(values.dni);
        if (error) {
                setError('dni', error);
                return;
            }
            await dispatch(fetchCredenciales(values));
            resetForm();
    }

  return (
    <Box sx={{width:'100%', ...panelSx}} display={"flex"} paddingX={2} paddingY={2}>
        <Stack flexGrow={1} direction={"column"} alignItems={"start"}>
            <Typography variant="subtitle1">Descargue la credencial del afiliado</Typography>
            <Typography variant="subtitle2">Ingrese el número de DNI del afiliado para descargar la credencial.</Typography>
        </Stack>
            <form onSubmit={handleSubmit} style={{display:'flex'}}>
            <Stack direction={"row"} display={"flex"} justifyContent={"end"} alignItems={'center'} gap={2}>
                <SearchInput name='dni' value={values.dni} onChange={handleChange} placeholder="Ingrese número de dni"></SearchInput>
                    <Box display="flex" justifyContent="center">
                        <Button variant="outlined" type="submit" loading={loading} sx={accionButtonSx}>
                            Descargar
                        </Button>
                    </Box>
            </Stack>
            </form>
    </Box>
  )
}
