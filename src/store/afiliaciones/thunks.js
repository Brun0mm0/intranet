import intranetApi from '../../api/intranetApi'
import {setAfiliado,setError,setLoading} from './afiliacionesSlice'
import { showNotification } from '../notification/notificationSlice.js'

export const fetchCredenciales = (datos) => {
    const {dni} = datos
    return async (dispatch) => {
        dispatch(setLoading(true))
        try {
            const {data} = await intranetApi.get(`credencial`, {params: {['dni']:dni}});
            if (data.success) {
                dispatch(setLoading(false));
                const response = await intranetApi.post(`credencial?dni=${dni}`, {}, { responseType: 'blob' })
                
                const blob = new Blob([response.data], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);
                
                const link = document.createElement("a");
                link.href = url;
                link.download = `credencial-${dni}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                dispatch(showNotification({ message: "Credencial descargado con éxito", type: "success" }));
            }
        } catch (error) {
            console.log(error)
            dispatch(setError('Error fetching data'));
            dispatch(showNotification({ message: error.response.data.error, type: "error" }) );
            dispatch(setLoading(false));
        }
    };
}
