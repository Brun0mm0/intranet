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
import MensajeriaWidget from './MensajeriaWidget';
import ContactosWidget from './ContactosWidget';
import { SideMenuContext } from './SideMenuContext';
import { useMemo, useState, useRef, useEffect } from 'react';

const expandedWidth = 240;
const collapsedWidth = 70;

// ✅ Antes: easing.sharp (pensado para elementos que se van rápido de la
// pantalla, ej. un snackbar) — se sentía "de golpe" en algo que el
// usuario controla con hover. easeInOut da una curva simétrica, más
// natural para algo que abre y cierra repetidamente.
const Drawer = styled(MuiDrawer)(({ theme, ownerState }) => ({
  width: ownerState.open ? expandedWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  [`& .${drawerClasses.paper}`]: {
    width: ownerState.open ? expandedWidth : collapsedWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),
  },
}));

export default function SideMenu({ usuario = "Usuario" }) {
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef(null);
  const openTimeoutRef = useRef(null);

  // ✅ Ahora también la apertura tiene un pequeño retardo: si el mouse
  // solo pasó de largo por encima del borde (sin quedarse), el timeout
  // se cancela antes de llegar a abrir — evita el "se abre solo por
  // accidente" al cruzar el mouse rápido.
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    openTimeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    };
  }, []);

  return (
    <SideMenuContext.Provider value={{open}}>
    <Drawer
      variant="permanent"
      ownerState={{ open }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        direction="column"
        spacing={2}
        sx={{
          p: 2,
          gap: open ? 1 : 0,
          alignItems: open ? 'flex-start' : 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          justifyContent: open ? 'flex-start' : 'center',
        }}
      >
        <MensajeriaWidget />
        <ContactosWidget />
        <Stack direction="row" sx={{ width: '100%', alignItems: 'center', justifyContent: open ? 'flex-start' : 'center', gap: 1 }}>
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
      </Stack>
    </Drawer>
    </SideMenuContext.Provider>
  );
}