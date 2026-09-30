import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { useSideMenu } from './SideMenuContext';
import { navItemSx } from './navStyles';

export default function MensajeriaWidget({ showBadge = false }) {
  const navigate = useNavigate();
  const { open } = useSideMenu();

  // ✅ Mismo criterio que MenuContent: sin borde/fondo de botón (el theme
  // se lo pone a todo IconButton por default), ícono escalado cuando el
  // side está colapsado, y label solo cuando está abierto.
  const content = (
    <ButtonBase
      onClick={() => navigate('/')}
      aria-label="Novedades"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        p: 1,
        justifyContent: open ? 'flex-start' : 'center',
        ...navItemSx(false),
      }}
    >
      <Badge
        variant="dot"
        invisible={!showBadge}
        sx={(theme) => ({
          [`& .${badgeClasses.badge}`]: { right: 2, top: 2, backgroundColor: 'rgb(2,181,126)' },
          // ✅ El scale va acá (no en el ListItemIcon de adentro) para que
          // ícono y punto crezcan juntos. Si se escala solo el ícono, éste
          // desborda la caja sobre la que el Badge calcula la posición del
          // punto y termina tapándolo.
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
          transform: open ? 'scale(1)' : 'scale(1.4)',
        })}
      >
        <ListItemIcon>
          {/* ✅ El theme (dataDisplay.jsx → MuiListItem) fuerza los íconos
              dentro de un <ListItem> a 1rem — como este botón no está
              dentro de uno (es un <ButtonBase> suelto en el footer), lo
              igualamos a mano para que quede del mismo tamaño que los
              íconos de navegación de MenuContent. */}
          <ForumRoundedIcon sx={{ width: '1rem', height: '1rem' }} />
        </ListItemIcon>
      </Badge>
      {open && <Typography variant="body2">Novedades</Typography>}
    </ButtonBase>
  );

  return open ? content : <Tooltip title="Novedades" placement="right" arrow>{content}</Tooltip>;
}
