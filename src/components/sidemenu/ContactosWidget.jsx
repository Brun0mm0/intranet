import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';
import { useSideMenu } from './SideMenuContext';

export default function ContactosWidget() {
  const navigate = useNavigate();
  const { open } = useSideMenu();

  // ✅ Mismo criterio que MensajeriaWidget: sin borde/fondo de botón, ícono
  // escalado cuando el side está colapsado, label solo cuando está abierto.
  const content = (
    <ButtonBase
      onClick={() => navigate('/contactos')}
      aria-label="Contactos"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        borderRadius: 1,
        p: 0.75,
        justifyContent: open ? 'flex-start' : 'center',
        '&:hover': { backgroundColor: 'action.hover' },
      }}
    >
      <ListItemIcon
        sx={(theme) => ({
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
          transform: open ? 'scale(1)' : 'scale(1.4)',
        })}
      >
        {/* ✅ Mismo ajuste que en MensajeriaWidget: el theme solo iguala
            el tamaño de ícono a 1rem para íconos dentro de un <ListItem>. */}
        <ContactPhoneRoundedIcon sx={{ width: '1rem', height: '1rem' }} />
      </ListItemIcon>
      {open && <Typography variant="body2">Contactos</Typography>}
    </ButtonBase>
  );

  return open ? content : <Tooltip title="Contactos">{content}</Tooltip>;
}
