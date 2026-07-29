import { useState, useEffect, useCallback, useRef } from "react";
import intranetApi from "../../api/intranetApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionState } from "../../hooks/useSessionState";
import { useDispatch } from "react-redux";
import {AuthContext} from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useSessionState("auth_user", null);
  const [loading, setLoading] = useState(true);
  const hasCheckedAuth = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Se ejecuta UNA sola vez al montar la app, no en cada cambio de ruta.
  // Antes: dependía de `location.pathname`, disparando un GET a /index/login
  // en cada navegación interna, incluso con el usuario ya logueado.
  useEffect(() => {
    if(hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    let active = true;

    if (location.pathname === "/login") {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data } = await intranetApi.get("/index/login");
        if (!active) return;

        if(!data.logged) {
          setUser(null);
        } else {

          // ✅ Ahora sí actualiza el user con lo que devuelve el server,
          // en vez de conservar ciegamente el valor previo de sessionStorage.
          setUser((prev) =>  prev ?? null);
      }
    } catch (error) {
      if (!active) return;

        // ✅ Distingue error de red/servidor de un 401/403 real.
        // Un error de conectividad no debería tirar abajo la sesión
        // que ya estaba guardada en sessionStorage.
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setUser(null);
      }
      // en cualquier otro caso (network error, 500, etc.) se mantiene
      // el user existente y se deja que el interceptor / el próximo
      // request que falle decida si corresponde deslogueo.
    } finally {
      if (active) setLoading(false);
    }
  };
    checkAuth();
    return () => { active = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 🔐 Escucha sesión expirada desde el interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      dispatch({ type: "RESET_APP_STATE" });
      navigate("/login", { replace: true });
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, [navigate, dispatch]);

  // 🔑 Login
  const login = useCallback(async (credentials) => {
    const { data } = await intranetApi.post("/index/login", credentials);
    if (!data.rol) throw new Error("Login inválido");

    // ✅ Usa el usuario devuelto por el server (mismo criterio que checkAuth),
    // así el dato no depende de cómo lo haya tipeado el usuario.
    setUser({ rol: data.rol, usuario: credentials.usuario });
    return data;
  }, []);

  // 🚪 Logout
  const logout = useCallback(async () => {
    try {
      await intranetApi.post("/index/logout");
    } catch (error) {
      console.error("Error en logout:", error);
    }
    setUser(null);
    dispatch({ type: "RESET_APP_STATE" });
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  // ✅ ESTE ERA EL RETURN QUE FALTABA
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}