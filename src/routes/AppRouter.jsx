import { Routes, Route } from 'react-router-dom';
import { routes } from './routerConfig';
import LoginPage from '../auth/LoginPage';
import ProtectedRoute from './ProtecetedRoute'
import NotFoundPage from '../pages/NotFoundPage'

const renderRoutes = (routes) => 
  routes.map(({ path, component: Component, protected: isProtected ,children }, i) => {
    const element = isProtected ? (
        <ProtectedRoute>
            <Component />
        </ProtectedRoute>
    )  : (
        <Component />
    );   
        return (
            <Route key={i} path={path} element={<Component />}>
      {children &&
        children.map(({ path: childPath, component: ChildComponent }, j) => (
            <Route key={j} path={childPath} element={<ChildComponent />} />
        ))}
    </Route>
    );
});

export default function AppRouter() {
    return(
      <Routes>
        {renderRoutes(routes)}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    )
}