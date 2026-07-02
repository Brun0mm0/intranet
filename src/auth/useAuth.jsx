import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import intranetApi from "../api/intranetApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionState } from "../hooks/useSessionState";
import { useDispatch } from "react-redux";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useSessionState("auth_user", null);
  const [loading, setLoading] = useState(true);
  const isAuthenticating = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let active = true;

    if (location.pathname === "/login") {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      if (isAuthenticating.current) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await intranetApi.get("/index/login");
        if (!active) return;

        if (!data.logged) {
          setUser(null);
        } else {
          setUser((prev) =>
            prev ?? { rol: data.rol, usuario: data.usuario }
          );
        }
      } catch (error) {
        if (!active) return;
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    checkAuth();
    return () => { active = false; };
  }, [location.pathname]);

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
    isAuthenticating.current = true;
    try {
      const { data } = await intranetApi.post("/index/login", credentials);
      if (!data.rol) throw new Error("Login inválido");
      setUser({ rol: data.rol, usuario: credentials.usuario });
      return data;
    } finally {
      isAuthenticating.current = false;
    }
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