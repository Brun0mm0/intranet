import { Stack, Button, Box, CircularProgress, Alert, IconButton, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { styled } from "@mui/material/styles";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { showNotification } from '../../../../store/notification/notificationSlice';

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const FormularioProcesarArchivoComponent = ({
    loading, 
    fetchFuncion,           //funcion thunk a ejecutar 
    tipoArchivo,            //palabra clave que debe contener el nombre del archivo
    extenciones = ['.txt']    //extenciones permitidas
  }) => {

    const dispatch = useDispatch();
    const [documento, setDocumento] = useState(null);
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) { return; }

        if (!file.name.includes(tipoArchivo)) {
          dispatch(showNotification({ message: `El archivo seleccionado debe contener como referencia la palabra ${tipoArchivo}` , type: "error" }));
          return
        }

        setDocumento(file);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
       if (!documento) {
          dispatch(showNotification({ message: "Seleccioná un archivo antes de enviar" , type: "error" }));
            return;
        }
        try {
            // Espera a que termine el thunk
            await dispatch(fetchFuncion({ documento }));
            setDocumento(null); // limpiar input
        } catch (error) {
            const { message } = error.response?.data || "Error desconocido";
            dispatch(showNotification({ message: `${message}`, type: "error" }));
        }
    };

    return (
    <>
    <Stack direction={"row"} alignItems="center" justifyContent="space-between" gap={2} >

      <Stack flexGrow={1} direction="column" alignItems="start">
        {/* <Typography variant="subtitle1">Relación Laboral</Typography> */}
        <Typography variant="subtitle1">{`Seleccione un archivo .txt de ${tipoArchivo} para procesar.`}</Typography>
      </Stack>

     <form onSubmit={handleSubmit} style={{ display: "flex" }}>
        <Stack direction="row" justifyContent="end" alignItems="center" gap={1}>
          <Button
            component="label"
            variant="contained"
            color="inherit"
            startIcon={<UploadFileIcon />}
              sx={{
                    backgroundColor: "#1976d2",   // color de fondo
                    color: "#fff",                // color del texto
                    textTransform: "none",        // evita mayúsculas automáticas
                    "&:hover": {                  // estilo al pasar el mouse
                    backgroundColor: "#1565c0"
                    }
                }}
            >
            Seleccionar Archivo
            <VisuallyHiddenInput type="file" accept={extenciones.join(",")} onChange={handleFileChange} />
          </Button>
          <Box position="relative" display="flex" justifyContent="center">
            <Button variant="outlined" type="submit" disabled={loading} >
              Enviar
            </Button>

            {loading && (
              <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
                />
              )}
          </Box>
        </Stack>
      </form>
      </Stack>
       { documento ? 
          <Stack x={2} pt={1}>
          <Alert
            action={
              <IconButton aria-label="close" color="inherit" size="small" onClick={() => {setDocumento(null);
              }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            } 
            severity="info"
            size="small"
            >{'Archivo seleccionado: ' + documento.name }</Alert>
            </Stack> 
            : 
            null
            }
    </>
    )
}
