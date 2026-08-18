import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSideMenu } from './SideMenuContext';
import { routes } from '../../routes/routerConfig';
import { useAuth } from '../../auth';

// 🎨 Color institucional — ícono del ítem de menú activo.
const INSTITUTIONAL_COLOR = '#009ada';

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useSideMenu();
  const { user } = useAuth();

  const role = user?.rol;

  const menuItems = routes
    .find(r => r.path === "/") // layout root
    ?.children
    ?.filter(r => r.showInMenu)
    ?.filter(r => !r.roles || r.roles.includes(role)) || [];

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List>
        {menuItems.map((item) => {
          const Icon = item.icon;

          // ✅ item.path viene sin barra inicial (ruta relativa, como hijo
          // anidado de '/' en routerConfig), pero location.pathname
          // siempre la tiene. Sin normalizar, la comparación de abajo
          // nunca daba true.
          const itemPath = item.path?.startsWith('/') ? item.path : `/${item.path}`;

          const isSelected =
            !!item.path &&
            (location.pathname === itemPath ||
              location.pathname.startsWith(itemPath + '/'));

          return (
            <ListItem key={item.path} sx={{ display: 'block', paddingX: 0 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => navigate(item.path)}
                sx={{
                  // ✅ El theme (dataDisplayCustomizations → MuiListItem)
                  // define '.MuiListItem-root .MuiButtonBase-root.Mui-selected'
                  // con más especificidad (3 clases) que este override — sin
                  // !important, el fondo del theme sigue ganando.
                  '&.Mui-selected': {
                    backgroundColor: 'transparent !important',
                    boxShadow: 'none',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={(theme) => ({
                    minWidth: 0,
                    transition: theme.transitions.create(['transform'], {
                      duration: theme.transitions.duration.shortest,
                    }),
                    transform: open ? 'scale(1)' : 'scale(1.4)',
                    // ✅ El theme (dataDisplayCustomizations → MuiListItem)
                    // le fija `color` directo al <svg> (no al div padre),
                    // tanto en estado normal como en .Mui-selected. La
                    // herencia desde acá nunca le gana a eso — hace falta
                    // apuntar al propio .MuiSvgIcon-root, con !important
                    // para no depender del orden de inserción de estilos.
                    '& .MuiSvgIcon-root': isSelected
                      ? { color: `${INSTITUTIONAL_COLOR} !important` }
                      : undefined,
                  })}
                >
                  <Icon />
                </ListItemIcon>
                {open && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}