import { Box, Typography } from "@mui/material";

/**
 * Contenedor estándar de página: fondo translúcido con blur, ocupa el alto
 * disponible debajo del Header sin desbordar la pantalla (flexGrow + minHeight 0).
 * El contenido que no entre debe scrollear dentro de sí mismo.
 */
export default function PageContainer({ title, direction = "column", children, sx, ...props }) {
    return (
        <Box
            component="section"
            width="100%"
            flexGrow={1}
            minHeight={0}
            borderRadius={2}
            p={2}
            display="flex"
            flexDirection={direction}
            gap={2}
            sx={{
                bgcolor: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                ...sx,
            }}
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
