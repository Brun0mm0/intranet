import intranetApi from "../../api/intranetApi";
import { delay } from "../../utils/utils";
import { startLoading, setError, setFacturas, setProveedor, resetState } from "./prestacionesSlice";

export const fetchConsultaFacturas = (datos) => {
    return async (dispatch) => {
        const {param, value} = datos;
            dispatch(startLoading());
        await delay(1000);
        
        try {
            const response = await intranetApi.get('/prestaciones_facturas/', {params:{[param]: value},
                headers: {
                    'Content-Type': 'application/json',
                 },
            });
            const primerRegistro = response.data?.[0];

            dispatch(setProveedor({
            cuit: primerRegistro?.PRV_CUIT || '',
            razon_social: primerRegistro?.PRV_RAZON_SOCIAL || '',
            }));
            dispatch(setFacturas(response.data));
        } catch (error) {
            let message = 'Error inesperado';

            if (error.code === 'ECONNABORTED') {
                message = 'La solicitud tardó demasiado';
            } else if (!error.response) {
                message = 'No hay conexión con el servidor';
            } else {
                message = error.response?.data?.message || 'Error del servidor';
            }

            dispatch(resetState());
            dispatch(setError(message));
        }
    }
}