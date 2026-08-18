import intranetApi from "../../api/intranetApi";
import { delay } from "../../utils/utils";
import { startLoading,
         setAfiliadoArr,
         setUltimoParametroBusqueda,
         reset,
         endLoading,
         setError,
         startDetalleLoading,
         setAfiliadoDetalle,
         setDetalleError,
         startAportesLoading,
         setAportes,
         setAportesError } from "./padronSlice";
import {showNotification} from '../notification/notificationSlice';

export const fetchAfiliadoArr = (datos) => {
    const { param, value, plan, sinDelay } = datos;

    return async (dispatch) => {
        dispatch(startLoading());
        // ✅ El delay artificial de 1s se salta cuando sinDelay=true —
        // usado por la auto-búsqueda de Apellido/Nombre, que necesita
        // responder rápido mientras el usuario tipea. El resto de las
        // búsquedas manuales (dni, cuil, etc.) lo siguen teniendo igual.
        if (!sinDelay) {
            await delay(1000);
        }
    try {
        if (plan) {
            const response = await intranetApi.get('intranet/',{params: {['plan']: plan}});
            dispatch(setAfiliadoArr(response.data));
            dispatch(setUltimoParametroBusqueda('plan'));
            return;
        }
        const response = await intranetApi.get('intranet/',{params: {[param]: value}});
        dispatch(setAfiliadoArr(response.data));
        dispatch(setUltimoParametroBusqueda(param));
    } catch (error) {
        // ✅ Antes: error.response.data.message explotaba si error.response
        // era undefined (error de red/timeout, sin respuesta del server),
        // dejando el thunk colgado en loading:true para siempre.
        dispatch(setError(error.message));
        dispatch(showNotification({ message: `No se pudo completar la búsqueda: ${error.message}`, type: 'error' }));
    }
 };
}

// ✅ Antes: recibía siempre afiliadoArr completo y hacía datos[0] adentro,
// así que sin importar en qué fila se hacía click en "Imprimir", siempre
// imprimía el primer resultado de la búsqueda. Ahora recibe directamente
// el afiliado puntual sobre el que se quiere imprimir.
export const printConsultaPadron = (afiliado) => {
    return async (dispatch) => {
        dispatch(startLoading());
        try {
            const response = await intranetApi.post('/intranet/', afiliado, {
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'blob'
        });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
                link.href = url;
                link.download = `Certificado.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

        } catch (error) {
            dispatch(showNotification({ message: `No se pudo generar el pdf`, type: 'error' }));
            dispatch(setError(error.message));
        } finally
        { dispatch(endLoading());}
    };}

export const resetPadrones = () => {
    return (dispatch) => {
        dispatch(reset());
    }};

export const fetchAfiliadoDetalle = (cuil) => {
    return async (dispatch) => {
        dispatch(startDetalleLoading());
        try {
            const { data } = await intranetApi.get('intranet/', { params: { cuil } });
            // El endpoint devuelve array (igual que la búsqueda múltiple);
            // acá siempre nos quedamos con el primer/único resultado.
            const detalle = Array.isArray(data) ? data[0] ?? null : data;
            dispatch(setAfiliadoDetalle(detalle));
        } catch (error) {
            dispatch(showNotification({ message: `No se pudo cargar el detalle del afiliado: ${error.message}`, type: 'error' }));
            dispatch(setDetalleError(error?.response?.data?.message ?? error.message));
        }
    };
}
export const fetchAportes = (datos) => {
    return async (dispatch) => {
        dispatch(startAportesLoading());
        try {
            const {data} = await intranetApi.get('/aportes/',{params: {['cuil']: datos}});

            const mapAportes = data.message
  .map((aporte) => {
    const date = new Date(aporte.Periodo);

    if (isNaN(date)) return null;

    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const anio = date.getFullYear();

    return {
      ...aporte,
      Periodo: `${mes}/${anio}`,
      _date: date,
    };
  })
  .filter(Boolean)
  .sort((a, b) => b._date - a._date)
  .slice(0, 5)
  .map(({ _date, ...rest }) => rest);

            dispatch(setAportes(mapAportes));
        }
        catch (error) {
            // ✅ Antes: usaba el setError compartido con afiliadoArr, que
            // vaciaba toda la tabla de resultados si fallaba esta consulta.
            dispatch(showNotification({ message: `No se pudieron cargar los aportes: ${error.message}`, type: 'error' }));
            dispatch(setAportesError(error?.response?.data?.message ?? error.message));
        }
    }
}