import axios from "axios";
import {store} from '../store/store';
import { delay } from "../utils/utils";
import { reset as ResetPadron } from "../store/padrones/padronSlice";
import { reset as ResetAfiliacion } from "../store/afiliaciones/afiliacionesSlice";
// import { logout } from '../auth/useAuth';
const DEV_BYPASS_AUTH = import.meta.env.VITE_DEV_BYPASS_AUTH === 'false';

const intranetApi = axios.create({
    // baseURL: '/api',   //PROD
    baseURL: 'http://130.130.2.53:9096/',
    withCredentials: true,
    timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

intranetApi.interceptors.response.use(
  response => response,
  async (error) => {

    // ⛔ TIMEOUT
    if (error.code === 'ECONNABORTED') {
      store.dispatch({
        type: 'notification/showNotification',
        payload: {message: 'La solicitud tardó demasiado (timeout)', type: 'error'}
      });
      return Promise.reject(error);
    }

    // 🔐 SESSION EXPIRED
    if (error.response?.status === 401) {
      // En modo dev bypass, un 401 real del backend no debe tirar abajo la sesion mockeada ni reditigit a /login.

      if (DEV_BYPASS_AUTH) {
        console.warn('🧪 DEV_BYPASS_AUTH: se ignora 401 real del backend');
        return Promise.reject(error);
      }

      await delay(500);
      store.dispatch(ResetPadron());
      store.dispatch(ResetAfiliacion());
      store.dispatch({
        type: 'notification/showNotification',
        payload: {message: 'La sesión expiró', type: 'error'}
      });
      // ✅ No emitir si ya estamos en login
      if (window.location.pathname !== '/login') {
        window.dispatchEvent(new Event('session-expired'));
      }
    }

    console.log('💥 Error desde el interceptor', error);
    return Promise.reject(error);
  }
);

export default intranetApi;


// 20-34643227-7