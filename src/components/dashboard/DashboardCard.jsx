import { Box, Stack, Typography } from "@mui/material";
import { panelSx } from "../../shared-theme/customizations/intranetStyles";

/** Bloque del bento del inicio: tarjeta blanca plana con título y acción opcional a la derecha. */
export default function DashboardCard({ title, action, children, sx, ...props }) {
    return (
        <Box
            sx={{ ...panelSx, borderRadius: 3, p: 2, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, ...sx }}
            {...props}
        >
            {(title || action) && (
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5} spacing={1}>
                    <Typography variant="subtitle1" fontWeight={700}>
                        {title}
                    </Typography>
                    {action}
                </Stack>
            )}
            {children}
        </Box>
    );
}
