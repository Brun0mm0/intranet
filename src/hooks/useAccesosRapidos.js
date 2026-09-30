import { useAuth } from "../auth";
import { routes } from "../routes/routerConfig";

// Rutas del menú a las que el usuario tiene acceso según su rol.
// `routes` se lee al llamar el hook (no a nivel módulo) por el import circular con routerConfig.
export function useAccesosRapidos() {
    const { user } = useAuth();

    const dashboardRoutes = routes.find((r) => r.path === "/");
    const menuItems = dashboardRoutes?.children?.filter((r) => r.showInMenu) ?? [];

    return menuItems.filter(
        (item) => !item.roles?.length || item.roles.includes(user?.rol)
    );
}
