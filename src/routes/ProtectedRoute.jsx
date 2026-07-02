import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";


export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (roles.length && !roles.includes(user.rol)) {
    console.warn("Acceso denegado: rol insuficiente", { user, requiredRoles: roles });
    return <Navigate to="/403" replace />;
  }

    return children
}