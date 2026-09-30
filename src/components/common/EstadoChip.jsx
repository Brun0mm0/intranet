import { Box } from "@mui/material";

// Estados con color fuerte y texto oscuro legible (en lugar de pintar filas enteras).
const ESTILOS = {
    vigente: { bg: "#dff5ec", color: "#017a55" },
    baja: { bg: "#fbe3e1", color: "#b3322a" },
    pendiente: { bg: "#fff1cc", color: "#8a5a00" },
    neutral: { bg: "#eef1f3", color: "#46565d" },
    info: { bg: "#e0f1fb", color: "#0a5f86" },
};

export default function EstadoChip({ estado = "neutral", label, sx }) {
    const { bg, color } = ESTILOS[estado] ?? ESTILOS.neutral;
    return (
        <Box
            component="span"
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.25,
                borderRadius: 99,
                bgcolor: bg,
                color,
                fontWeight: 700,
                fontSize: "0.75rem",
                lineHeight: 1.6,
                whiteSpace: "nowrap",
                "&::before": { content: '""', width: 7, height: 7, borderRadius: "50%", bgcolor: "currentColor" },
                ...sx,
            }}
        >
            {label}
        </Box>
    );
}
