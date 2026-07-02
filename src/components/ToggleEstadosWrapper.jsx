import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stack, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSessionState } from "../hooks/useSessionState";

export const ToggleEstadosWrapper = ({ title, children }) => {
  // const [] = useState(false);

  const [verEstados, setVerEstados] = useSessionState(
    `toggle-${title}`,
    false
  )

  return (
    <AnimatePresence>
      <Stack sx={{ py: 0.5, px: 2, borderRadius: 1 }}>
        {verEstados ? (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1">{title}</Typography>
              <IconButton size="small" onClick={() => setVerEstados(false)}>
                <RemoveIcon />
              </IconButton>
            </Stack>
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="closed"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">{title}</Typography>
              <IconButton size="small" onClick={() => setVerEstados(true)}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
          </motion.div>
        )}
      </Stack>
    </AnimatePresence>
  );
};
