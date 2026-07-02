import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routerConfig';
import ProtectedRoute from './ProtectedRoute';
import NotFoundPage from '../pages/NotFoundPage';

const renderRoutes = (routesToRender) => 
  routesToRender.map(
    (
      { path, 
        component: Component, 
        protected: isProtected, 
        children, 
        roles,
        redirectTo}, 
        i
      ) => {
    
    // ✅ manejar redirección
    if (redirectTo) {
      return(
        <Route
        key={path || `route-${i}`}
        path={path}
        element={<Navigate to={redirectTo} replace />}
        />
      )
    };

    const element = isProtected ? (
      <ProtectedRoute roles={roles}>
        <Component />
      </ProtectedRoute>
    ) : (
      <Component />
    );

    // Si tiene hijos, renderizar la ruta con anidación
    if (children?.length > 0) {
      return (
        <Route key={path || `route-${i}`} path={path} element={element}>
          {renderRoutes(children)}
        </Route>
      );
    }

    // Ruta sin hijos
    return <Route key={path || `route-${i}`} path={path} element={element} />;
  });

export default function AppRouter() {
  return (
    <Routes>
      {renderRoutes(routes)}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}