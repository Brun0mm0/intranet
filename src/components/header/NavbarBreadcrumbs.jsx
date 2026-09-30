import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import { routes } from '../../routes/routerConfig';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.text.secondary,
    margin: theme.spacing(0, 0.5),
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

// Label e ícono de la ruta hija de "/" que coincide con el segmento.
// `routes` se lee en render (no a nivel módulo) por el import circular con routerConfig.
const getRouteInfo = (segment) => {
  const children = routes.find((r) => r.path === '/')?.children ?? [];
  const route = children.find((r) => r.path === segment);
  const fallback = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  return { label: route?.label ?? fallback, Icon: route?.icon };
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();

  // Dividimos la ruta actual en segmentos
  const pathnames = location.pathname.split('/').filter((x) => x);
  const enRaiz = pathnames.length === 0;

  const currentSx = { color: 'text.primary', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 };
  const ancestorSx = { color: 'text.secondary', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 };

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {/* raíz */}
      {enRaiz ? (
        <Typography sx={currentSx} aria-current="page">
          <HomeRoundedIcon color="primary" fontSize="small" />
          Panel Osssb
        </Typography>
      ) : (
        <Link component={RouterLink} to="/" underline="hover" sx={ancestorSx}>
          <HomeRoundedIcon fontSize="small" />
          Panel Osssb
        </Link>
      )}

      {pathnames.map((value, index) => {
        const { label, Icon } = getRouteInfo(value);
        const esActual = index === pathnames.length - 1;
        const to = '/' + pathnames.slice(0, index + 1).join('/');

        return esActual ? (
          <Typography key={to} sx={currentSx} aria-current="page">
            {Icon && <Icon color="primary" fontSize="small" />}
            {label}
          </Typography>
        ) : (
          <Link key={to} component={RouterLink} to={to} underline="hover" sx={ancestorSx}>
            {label}
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
}
