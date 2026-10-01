import { useEffect, useState } from 'react'
import {
  Box, IconButton, Stack, Table, TableBody, MenuItem, TableCell, TableContainer, TableHead, TableRow, Select, TablePagination, Tooltip, Typography,
} from '@mui/material'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import { ROLES, ROLES_IDS } from '../roles'
import { formatCuilTexto } from '../../../utils/utils'
import { tableHeadSx } from '../../../shared-theme/customizations/dataGrid'

const columns = [
  { id: 'NombreUsuario', label: 'Usuario' },
  { id: 'Contrasena', label: 'Contraseña' },
  { id: 'Email', label: 'Email' },
  { id: 'cuil', label: 'CUIL' },
  { id: 'Rol', label: 'Rol' },
];

const iniciales = (nombre = '') => nombre.slice(0, 2).toUpperCase();

// 🔹 Contraseña oculta por defecto; el botón del ojo la muestra solo en esa fila.
// ⚠️ Esto la oculta en pantalla, pero el backend la sigue enviando en texto plano: pendiente de revisar.
function CeldaContrasena({ valor, usuario }) {
  const [visible, setVisible] = useState(false);
  if (!valor) return <Box component="span" sx={{ color: '#8a979d' }}>—</Box>;
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Box component="span" sx={{ fontFamily: visible ? 'inherit' : 'monospace', letterSpacing: visible ? 0 : '0.1em', minWidth: 90 }}>
        {visible ? valor : '••••••••'}
      </Box>
      <Tooltip title={visible ? 'Ocultar contraseña' : 'Ver contraseña'}>
        <IconButton
          size="small"
          aria-label={`${visible ? 'Ocultar' : 'Ver'} contraseña de ${usuario}`}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          sx={{ width: 28, height: 28, border: 'none', borderRadius: '50%', bgcolor: 'transparent', color: 'text.secondary', '&:hover': { bgcolor: 'action.hover', color: '#0079a0' } }}
        >
          {visible ? <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 18 }} />}
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

function RolDot({ rolId }) {
  return <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: ROLES[rolId]?.color ?? '#8a979d', flexShrink: 0 }} />;
}

export const ListaUsuariosComponent = ({ usuarios, onCambioRol, filaPendiente }) => {
  const [rolesLocales, setRolesLocales] = useState({});
  const [pagina, setPagina] = useState(0);
  const [porPagina, setPorPagina] = useState(25);

  useEffect(() => {
    const inicial = {};
    usuarios.forEach(usuario => {
      inicial[usuario.id] = usuario.rol_id;
    });
    setRolesLocales(inicial);
  }, [usuarios])

  // Si cambia el filtro y la página actual quedó vacía, volver a la primera
  useEffect(() => {
    if (pagina * porPagina >= usuarios.length) setPagina(0);
  }, [usuarios.length, pagina, porPagina]);

  const handleChangeRol = (usuario, nuevoRolId) => {
    setRolesLocales(prev => ({ ...prev, [usuario.id]: nuevoRolId }));
    onCambioRol(usuario, nuevoRolId);
  };

  const visibles = usuarios.slice(pagina * porPagina, pagina * porPagina + porPagina);

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <TableContainer sx={{ flex: 1 }}>
        <Table stickyHeader size="small" aria-label="Lista de usuarios">
          <TableHead>
            <TableRow sx={tableHeadSx}>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibles.map((usuario) => {
              const isPendiente = filaPendiente === usuario.id
              const rolActual = rolesLocales[usuario.id] ?? ''

              return (
                <TableRow key={usuario.id} hover sx={{ '& td': { borderColor: '#edf1f3' } }}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.25}>
                      <Box
                        sx={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          bgcolor: ROLES[usuario.rol_id]?.color ?? '#0079a0', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.72rem', fontWeight: 700,
                        }}
                      >
                        {iniciales(usuario.NombreUsuario)}
                      </Box>
                      <Typography variant="body2" fontWeight={700}>{usuario.NombreUsuario}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <CeldaContrasena valor={usuario.Contrasena} usuario={usuario.NombreUsuario} />
                  </TableCell>
                  <TableCell>{usuario.Email}</TableCell>
                  <TableCell sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{formatCuilTexto(usuario.cuil) ?? '—'}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Select
                        size="small"
                        value={rolActual}
                        onChange={(e) => handleChangeRol(usuario, Number(e.target.value))}
                        disabled={isPendiente}
                        aria-label={`Rol de ${usuario.NombreUsuario}`}
                        sx={{ minWidth: 190, '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 } }}
                        renderValue={(id) => (
                          <>
                            <RolDot rolId={id} />
                            {ROLES[id]?.label ?? 'Sin rol'}
                          </>
                        )}
                      >
                        {ROLES_IDS.map((rolId) => (
                          <MenuItem key={rolId} value={rolId} sx={{ gap: 1 }}>
                            <RolDot rolId={rolId} />
                            {ROLES[rolId].label}
                          </MenuItem>
                        ))}
                      </Select>
                      {isPendiente && (
                        <Typography variant="caption" sx={{ color: '#0079a0', fontWeight: 600 }}>Guardando…</Typography>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={usuarios.length}
        page={pagina}
        onPageChange={(e, p) => setPagina(p)}
        rowsPerPage={porPagina}
        onRowsPerPageChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(0); }}
        rowsPerPageOptions={[25, 50, 100]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        sx={{ borderTop: 1, borderColor: '#e1e8eb' }}
      />
    </Box>
  )
}
