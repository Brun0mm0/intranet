import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, Button, Typography, IconButton } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion, AnimatePresence } from 'motion/react';
import { useMemo, useState } from "react";

export const ListaRelacionLaboralComponent = ({ vista = [], loading }) => {
  const [mostrarTodo, setMostrarTodo] = useState(false);

  // Ordenamos del más reciente al más antiguo (por fecha si existe)
  const vistaOrdenada = useMemo(() => [...vista].reverse(), [vista]);

    // Estado Ultimos archivos procesados
  const [verEstados, setVerEstados] = useState(false);

  // Manejar ver estados
  const handleVerEstados = () => {
    setVerEstados(!verEstados);
  };

  // Determinamos qué parte mostrar
  const vistaVisible = mostrarTodo ? vistaOrdenada : vistaOrdenada.slice(0, 1);

  if (loading) return <p>Cargando datos...</p>;
  if (!vista.length) return <p>No hay archivos procesados.</p>;

  return (
      <>
      <TableContainer>
        <Table size="small" aria-label="historial fiscalización">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Archivo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vistaVisible.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item || "Sin nombre"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Botón para alternar la vista */}
      {vista.length > 1 && (
        <Stack direction="row" justifyContent="center" mt={1}>
          <Button
            variant="text"
            size="small"
            onClick={() => setMostrarTodo((prev) => !prev)}
          >
            {mostrarTodo ? "Mostrar menos" : "Ver todos"}
          </Button>
        </Stack>
      )}
    </>
  );
};
