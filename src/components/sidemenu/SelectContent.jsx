import { Box, Typography } from '@mui/material';
import { useSideMenu } from './SideMenuContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SelectContent() {
  const { open } = useSideMenu();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      paddingInline={open ? 2 : 0}
      justifyContent="center"
      gap={1}
      overflow="hidden" // evita que se vea fuera del contenedor durante la animación
      width="100%"
    >
      <AnimatePresence mode="wait">
        {open ? (
          <motion.img
            key="logo-full"
            src="/logo.png"
            alt="logo"
            style={{ maxWidth: '100%', maxHeight: '47.5px' }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        ) : (
          <motion.img
            key="logo-mini"
            src="/logo-miniatura-web.png"
            alt="logo mini"
            style={{ maxWidth: '100%', maxHeight: '47.5px' }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key="label"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Typography variant="subtitle2">Intranet</Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
