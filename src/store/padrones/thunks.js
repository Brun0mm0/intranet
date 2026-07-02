import intranetApi from "../../api/intranetApi";
import {delay} from "../../utils/utils";
import { startLoading,
         setAfiliadoArr,
         setAportes,
         reset,
         endLoading,
         setError } from "./padronSlice";
         
export const fetchAfiliadoArr = (datos) => {
    const { param, value, plan } = datos;      
    
    return async (dispatch) => {
        dispatch(startLoading());
        delay(1000)   
    try {
        if (plan) {
            const response = await intranetApi.get('intranet/',{params: {['plan']: plan}});
            dispatch(setAfiliadoArr(response.data));
            return;
        }
        const response = await intranetApi.get('intranet/',{params: {[param]: value}});
        dispatch(setAfiliadoArr(response.data));
    } catch (error) {
        console.log(error.response.data.message);
        dispatch(setError(error.message));
    }
 };
}

export const printConsultaPadron = (datos) => {
    return async (dispatch) => {
        dispatch(startLoading());
        try {
            const response = await intranetApi.post('/intranet/', datos[0],{
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
            console.log(error.code, error.message);
            dispatch(setError(error.message));
        } finally 
        { dispatch(endLoading());}
    };}

export const resetPadrones = () => {
    return (dispatch) => {
        dispatch(reset());
    }};

export const fetchAportes = (datos) => {
    return async (dispatch) => {
        dispatch(startLoading());
        try {
            const {data} = await intranetApi.get('/aportes/',{params: {['cuil']: datos}});

            const mapAportes = data.message
  .map((aporte) => {
    const date = new Date(aporte.Periodo);

    // Validar si la fecha es correcta
    if (isNaN(date)) return null;

    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const anio = date.getFullYear();

    return {
      ...aporte,
      Periodo: `${mes}/${anio}`, // sobrescribís el valor con el formato que quieras
      _date: date,               // opcional, lo guardás para poder ordenar
    };
  })
  .filter(Boolean) // saca los null si alguna fecha vino mal
  .sort((a, b) => b._date - a._date) // ordena más reciente → más antiguo
  .slice(0, 5) // tomás los primeros 5
  .map(({ _date, ...rest }) => rest); // quitás la propiedad auxiliar

            dispatch(setAportes(mapAportes));
        } 
        catch (error) {
            dispatch(setError(error.message));
        }
    }
}