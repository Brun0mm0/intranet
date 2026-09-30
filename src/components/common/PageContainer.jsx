import { Box, Typography } from "@mui/material";

/**
 * Contenedor estándar de página: sin fondo propio (los bloques internos usan panelSx),
 * ocupa el alto disponible debajo del Header sin desbordar la pantalla (flexGrow + minHeight 0).
 * El contenido que no entre debe scrollear dentro de sí mismo.
 */
export default function PageContainer({ title, direction = "column", children, sx, ...props }) {
    return (
        <Box
            component="section"
            width="100%"
            flexGrow={1}
            minHeight={0}
            display="flex"
            flexDirection={direction}
            gap={2}
            sx={sx}
            {...props}
        >
            {title && (
                <Typography variant="h4" width="100%" align="left">
                    {title}
                </Typography>
            )}
            {children}
        </Box>
    );
}
