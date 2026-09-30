import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { useAccesosRapidos } from "../../hooks/useAccesosRapidos";

const PROXIMAMENTE = [
    { label: "Mi Credencial", path: "mi-credencial", icon: BadgeRoundedIcon, comingSoon: true },
    { label: "Mis Haberes", path: "mi-recibo", icon: ReceiptLongRoundedIcon, comingSoon: true },
];

// Alterna los dos colores de marca entre los accesos
const COLORES = [
    { fondo: "#e6f6fb", icono: "#00a9da" },
    { fondo: "#e3f7ef", icono: "#02b57e" },
];

export default function AccesosRapidosGrid() {
    const accesibles = useAccesosRapidos();
    const items = [...accesibles, ...PROXIMAMENTE];

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))"
            gap={1.5}
            sx={{ overflowY: "auto", minHeight: 0 }}
        >
            {items.map((item, i) => (
                <AccesoTile key={item.path} item={item} color={COLORES[i % COLORES.length]} />
            ))}
        </Box>
    );
}

function AccesoTile({ item, color }) {
    const Icon = item.icon;
    const soon = item.comingSoon;

    return (
        <Card variant="outlined" sx={{ p: 0, borderRadius: 2, opacity: soon ? 0.6 : 1 }}>
            <CardActionArea
                component={soon ? "div" : RouterLink}
                to={soon ? undefined : `/${item.path}`}
                disabled={soon}
                sx={{ p: 1.5, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 1.5, height: "100%" }}
            >
                <Box
                    sx={{
                        width: 40, height: 40, borderRadius: 2, flexShrink: 0,
                        bgcolor: color.fondo, color: color.icono,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >
                    {Icon && <Icon />}
                </Box>
                <Box minWidth={0}>
                    <Typography variant="body1" fontWeight={600} noWrap>
                        {item.label}
                    </Typography>
                    {soon && (
                        <Typography variant="caption" color="text.secondary">
                            Próximamente
                        </Typography>
                    )}
                </Box>
            </CardActionArea>
        </Card>
    );
}
