import { Box, Paper, Stack, Table, TableBody, MenuItem, TableCell, TableContainer, TableHead, TableRow, Select } from '@mui/material'
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const columns = [
  { id: 'NombreUsuario', label: 'Nombre de Usuario' },
  { id: 'Contrasena', label: 'Contraseña' },
  { id: 'Email', label: 'Email' },
  { id: 'cuil', label: 'CUIL' },
  { id: 'Rol', label: 'Rol', align: 'center' },
];

const rolesMap = {
1: 'Administrador',
2: 'Usuario',
3: 'Recursos Humanos',
4: 'Empleado',
5: 'Afiliaciones',
6: 'Sucursales',
7: 'Prestaciones'
};

export const ListaUsuariosComponent = ({ usuarios, onCambioRol, filaPendiente }) => {

  const [rolesLocales, setRolesLocales] = useState({});

  useEffect(() => {
    const inicial = {};
    usuarios.forEach(usuario => {
      inicial[usuario.id] = usuario.rol_id;
    });
    setRolesLocales(inicial);
  },[usuarios])

 const handleChangeRol = (usuario, nuevoRolId) => {
    setRolesLocales(prev => ({ ...prev, [usuario.id]: nuevoRolId }));
    onCambioRol(usuario, nuevoRolId);
  };

  return (
    <Paper>
      <TableContainer sx={{ height: 'calc(100vh - 180px)' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'} sx={{ padding: 1, fontWeight: 'bold' }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => {
              const isPendiente = filaPendiente === usuario.id

              return (
                <TableRow
                  key={usuario.id}
                  sx={{
                    transition: 'background-color 0.3s ease',
                    backgroundColor: isPendiente ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                  }}
                >
                  <TableCell sx={{ padding: 1 }}>{usuario.NombreUsuario}</TableCell>
                  <TableCell sx={{ padding: 1 }}>{usuario.Contrasena}</TableCell>
                  <TableCell sx={{ padding: 1 }}>{usuario.Email}</TableCell>
                  <TableCell sx={{ padding: 1 }}>{usuario.cuil}</TableCell>
                  <TableCell align='center' sx={{ padding: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Select
                        size="small"
                        value={rolesLocales[usuario.id] ?? ''}
                        onChange={(e) => handleChangeRol(usuario, Number(e.target.value))}
                        disabled={isPendiente}
                        sx={{ minWidth: 180 }}
                      >
                        {Object.entries(rolesMap).map(([rolId, label]) => (
                          <MenuItem key={rolId} value={Number(rolId)}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                      {isPendiente && (
                        <CircularProgress size={16} thickness={5} />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
