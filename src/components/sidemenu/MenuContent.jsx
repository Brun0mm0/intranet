import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSideMenu } from './SideMenuContext';
import { routes } from '../../routes/routerConfig';
import { useAuth } from '../../auth';
import { navItemSx } from './navStyles';

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
              {/* Con el menú cerrado, el nombre aparece al pasar el mouse */}
              <Tooltip title={open ? '' : item.label} placement="right" arrow>
              <ListItemButton
                selected={isSelected}
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                sx={{
                  ...navItemSx(isSelected),
                  justifyContent: open ? 'flex-start' : 'center',
                  minHeight: 44,
                }}
              >
                <ListItemIcon
                  sx={(theme) => ({
                    minWidth: 0,
                    transition: theme.transitions.create(['transform'], {
                      duration: theme.transitions.duration.shortest,
                    }),
                    transform: open ? 'scale(1)' : 'scale(1.4)',
                  })}
                >
                  <Icon />
                </ListItemIcon>
                {open && <ListItemText primary={item.label} />}
              </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}