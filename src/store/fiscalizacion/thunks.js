import intranetApi from '../../api/intranetApi'
import { delay } from "../../utils/utils.js"
import { showNotification } from '../notification/notificationSlice.js';
import {
    startEnvioRelacionesLaborales, successEnvioRelacionesLaborales, errorEnvioRelacionesLaborales,
    startListadoArchivos, successListadoArchivos, errorListadoArchivos,
    startEnvioDomiciliosExplotacion, successEnvioDomiciliosExplotacion, errorEnvioDomiciliosExplotacion,
    startListadoDomicilios, successListadoDomicilios, errorListadoDomicilios
} from './fiscalizacionSlice';

const UploadFileThunk = async (
        url, 
        datos, 
        dispatch, 
        { 
            startSlice, 
            successSlice, 
            errorSlice, 
            successMessage = "Achivo procesado Correctamente"
    }) => {

    dispatch(startSlice());

    const formData = new FormData();
    formData.append('documento', datos.documento);

    await delay(2000);
    try {
        const { data } = await intranetApi.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data'},
        });

        if (data.message === "ARCHIVO YA PROCESADO") {
            dispatch(showNotification({message: data.message, type: "info"}));
            dispatch(successSlice())
            return;
        }

        dispatch(successSlice())
        dispatch(showNotification({message: data.message, type: "success"}))
    } catch (error) {
        const message = error?.response?.data?.message || error.message || "Error desconocido";
        
        dispatch(errorSlice(message))
        dispatch(showNotification({message, type: "error"}))
    }
}

// ------------------------------------------------------------
// ANCHOR 🔸 Subida de archivo Relaciones laborales - Domicilio Explotación *POST* 
// ------------------------------------------------------------

export const fetchRelacionLaboralUpload = (datos) => async(dispatch) => {
    await UploadFileThunk('relacionlaboral/', datos, dispatch, {
        startSlice: startEnvioRelacionesLaborales,
        successSlice: successEnvioRelacionesLaborales,
        errorSlice: errorEnvioRelacionesLaborales,
    });
};

export const fetchDomicilioExplotacionUpload = (datos) => async(dispatch) => {
    await UploadFileThunk('domicilio/', datos, dispatch, {
        startSlice: startEnvioDomiciliosExplotacion,
        successSlice: successEnvioDomiciliosExplotacion,
        errorSlice: errorEnvioDomiciliosExplotacion
    })
}

// ------------------------------------------------------------
// ANCHOR 🔸 Pedido arreglos Lista Archivos Subidos - Domicilio de Explotación *GET*
// ------------------------------------------------------------

export const fetchListaArchivosProcesados = () => async(dispatch) => {
    dispatch(startListadoArchivos())
    try {
            const {data} = await intranetApi.get(`lista/`);
            dispatch(successListadoArchivos(data.archivos))
            return;
        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Error desconocido";
            dispatch(errorListadoArchivos(message))
            dispatch(showNotification({ message: error.message, type: "error" }));
        } 
    };
    
    export const fetchListaDomicilioExplotacion = (cuit) => async(dispatch) => {
        dispatch(startListadoDomicilios())
        try {
            const {data} = await intranetApi.get(`relacionlaboral/`, {params: {['cuit']: cuit}});
            dispatch(successListadoDomicilios(data.message))
            return;
        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Error desconocido";
            dispatch(errorListadoDomicilios(message))
            dispatch(showNotification({ message: error.message, type: "error" }));
        }
    };
