// 🎨 Estilos del menú lateral (opción "blanco con activo sólido").
// Los usan MenuContent y los accesos del pie (Novedades, Contactos) para verse iguales.

export const NAV_ACTIVO = '#00a9da';      // celeste institucional: fondo del ítem activo
const NAV_ICONO = '#33434a';              // íconos en reposo: gris oscuro (antes gris claro, poco contraste)
const NAV_HOVER_BG = '#e6f6fb';
const NAV_HOVER_ICONO = '#0079a0';

// El theme (dataDisplayCustomizations → MuiListItem) fija el color directo en el <svg>
// y el fondo de .Mui-selected con más especificidad: hace falta !important para ganarle.
export const navItemSx = (selected) => ({
  borderRadius: 2.5,
  color: selected ? '#fff' : NAV_ICONO,
  backgroundColor: selected ? `${NAV_ACTIVO} !important` : 'transparent',
  boxShadow: selected ? '0 3px 10px rgba(0,169,218,0.35)' : 'none',
  transition: 'background-color 120ms, color 120ms',
  '& .MuiSvgIcon-root': { color: `${selected ? '#fff' : NAV_ICONO} !important` },
  '& .MuiListItemText-primary, & .MuiTypography-root': { color: 'inherit', fontWeight: 600 },
  '&:hover': {
    backgroundColor: selected ? `${NAV_ACTIVO} !important` : NAV_HOVER_BG,
    color: selected ? '#fff' : NAV_HOVER_ICONO,
    '& .MuiSvgIcon-root': { color: `${selected ? '#fff' : NAV_HOVER_ICONO} !important` },
  },
  '&.Mui-focusVisible': { outline: `2px solid ${NAV_ACTIVO}`, outlineOffset: 2 },
});
