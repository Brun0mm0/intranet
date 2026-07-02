import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack }from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSideMenu } from './SideMenuContext';
import {routes} from '../../routes/routerConfig';
import { useAuth } from '../../auth';

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
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          const isSelected =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/');

          return (
            <ListItem key={index} sx={{ display: 'block', paddingX: 0 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                   sx={theme =>({
                      minWidth: 0,
                      transition: theme.transitions.create('transform', {
                      duration: theme.transitions.duration.shortest,
                    }),
                    transform: open ? 'scale(1)' : 'scale(1.4)',
                     '&.Mui-selected': {
                      backgroundColor: 'red',
                    },

                    '&.Mui-selected:hover': {
                      backgroundColor: 'red',
                    },
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