import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OptionsMenu from './OptionsMenu';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import { SideMenuContext } from './SideMenuContext';

const expandedWidth = 240;
const collapsedWidth = 70;

const Drawer = styled(MuiDrawer)(({ theme, ownerState }) => ({
  width: ownerState.open ? expandedWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
  [`& .${drawerClasses.paper}`]: {
    width: ownerState.open ? expandedWidth : collapsedWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
  },
}));

export default function SideMenu({ usuario = "Usuario" }) {
  const [open, setOpen] = React.useState(false);

  return (
    <SideMenuContext.Provider value={{open}}>
    <Drawer
      variant="permanent"
      ownerState={{ open }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* Encabezado */}
      <Box sx={{ display: 'flex', p: 1.5, mt: 1, minHeight: '6rem' }}>
        <SelectContent />
      </Box>

      <Divider />

      {/* Contenido del menú */}
      <Box
        sx={{
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent collapsed={!open} />
      </Box>

      {/* Footer con avatar y usuario */}
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: open ? 1 : 0,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          justifyContent: open ? 'flex-start' : 'center',
        }}
      >
        <Avatar
          alt={usuario}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />

        {open && (
          <Box sx={{ mr: 'auto' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {usuario}
            </Typography>
          </Box>
        )}

        {open && <OptionsMenu />}
      </Stack>
    </Drawer>
    </SideMenuContext.Provider>
  );
}
