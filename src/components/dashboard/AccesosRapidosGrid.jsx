import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { useAccesosRapidos } from "../../hooks/useAccesosRapidos";
import { MARINO } from "../../shared-theme/customizations/dataGrid";

// Color del cuadradito del ícono en los accesos chicos (se alternan)
const COLORES_ICONO = ["#017a55", "#0079a0", MARINO];

const PROXIMAMENTE = {
    key: "proximamente",
    label: "Mi Credencial · Mis Haberes",
    description: "Próximamente",
    icons: [BadgeRoundedIcon, ReceiptLongRoundedIcon],
};

// 🔹 Acceso rápido del inicio.
// Los accesos salen de useAccesosRapidos: solo las secciones del menú habilitadas para el rol del usuario.
// La primera ocupa un bloque grande con el degradado institucional; el resto va en tiles claros
// y al final un tile punteado con lo que todavía no está disponible.
export default function AccesosRapidosGrid() {
    const accesibles = useAccesosRapidos();
    const [principal, ...resto] = accesibles;
    const chicos = [...resto, PROXIMAMENTE];

    // Los accesos chicos van en 2 columnas (o 1 si hay uno solo); el principal ocupa todas las filas
    const columnas = chicos.length > 1 ? 2 : 1;
    const filas = Math.ceil(chicos.length / columnas);

    return (
        <Box
            flex={1}
            minHeight={0}
            display="grid"
            gap={1.25}
            sx={{
                overflowY: "auto",
                // Aire interno para que la elevación y la sombra del hover no queden recortadas por el overflow;
                // el margen negativo compensa y los tiles siguen alineados con el título de la tarjeta.
                p: 1,
                m: -1,
                gridTemplateColumns: principal ? { xs: "1fr", sm: `1.3fr repeat(${columnas}, 1fr)` } : `repeat(${columnas}, 1fr)`,
                gridTemplateRows: { sm: `repeat(${filas}, minmax(76px, 1fr))` },
            }}
        >
            {principal && (
                <Box sx={{ gridRow: { sm: `1 / span ${filas}` }, display: "flex" }}>
                    <AccesoPrincipal item={principal} />
                </Box>
            )}
            {chicos.map((item, i) =>
                item.key === "proximamente" ? (
                    <AccesoProximamente key={item.key} item={item} />
                ) : (
                    <AccesoTile key={item.path} item={item} color={COLORES_ICONO[i % COLORES_ICONO.length]} />
                )
            )}
        </Box>
    );
}

const tileBaseSx = {
    width: "100%",
    borderRadius: 3,
    p: 1.75,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 1.5,
    textAlign: "left",
    transition: "transform 120ms, box-shadow 120ms",
    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 16px rgba(11,59,79,0.15)" },
    "&.Mui-focusVisible": { outline: "2px solid #0079a0", outlineOffset: 2 },
    "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
};

function IconoCuadrado({ icon, bg }) {
    const Icon = icon;
    return (
        <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon />
        </Box>
    );
}

// Acceso principal: bloque grande con una versión suave del degradado institucional.
// ✅ Antes usaba el mismo degradado saturado que el banner y competía con él;
// ahora se destaca por tamaño y por el ícono en celeste institucional, no por el fondo.
const DEGRADADO_SUAVE = "linear-gradient(135deg, #e3f4fb 0%, #eef9f5 100%)";

function AccesoPrincipal({ item }) {
    const Icon = item.icon;
    return (
        <ButtonBase
            component={RouterLink}
            to={`/${item.path}`}
            sx={{ ...tileBaseSx, backgroundImage: DEGRADADO_SUAVE, border: 1, borderColor: "#c9e7f2", color: MARINO, p: 2.25 }}
        >
            {Icon && (
                <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: "#00a9da", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon />
                </Box>
            )}
            <Box>
                <Typography variant="h6" fontWeight={700} color="inherit" lineHeight={1.25}>
                    {item.label}
                </Typography>
                {item.description && (
                    <Typography variant="body2" sx={{ color: "#46565d", mt: 0.25 }}>
                        {item.description}
                    </Typography>
                )}
                <Typography variant="body2" sx={{ color: "#0079a0", fontWeight: 700, mt: 1 }}>
                    Ir a {item.label} →
                </Typography>
            </Box>
        </ButtonBase>
    );
}

// Accesos secundarios: tile claro con el ícono en un cuadrado de color
function AccesoTile({ item, color }) {
    const Icon = item.icon;
    return (
        <ButtonBase component={RouterLink} to={`/${item.path}`} sx={{ ...tileBaseSx, bgcolor: "#f3f9fc", border: 1, borderColor: "#d9ecf4" }}>
            {Icon && <IconoCuadrado icon={Icon} bg={color} />}
            <Box minWidth={0}>
                <Typography variant="body1" fontWeight={700} lineHeight={1.3}>
                    {item.label}
                </Typography>
                {item.description && (
                    <Typography variant="body2" color="text.secondary">
                        {item.description}
                    </Typography>
                )}
            </Box>
        </ButtonBase>
    );
}

// Lo que todavía no está disponible: tile punteado y tenue, sin link
function AccesoProximamente({ item }) {
    return (
        <Box sx={{ ...tileBaseSx, "&:hover": {}, border: "1px dashed #b9c9d0", bgcolor: "#fff", opacity: 0.8 }} aria-disabled="true">
            <Stack direction="row" spacing={0.75}>
                {item.icons.map((Icon, i) => (
                    <IconoCuadrado key={i} icon={Icon} bg="#c3d0d6" />
                ))}
            </Stack>
            <Box>
                <Typography variant="body1" fontWeight={700} lineHeight={1.3} sx={{ color: "#46565d" }}>
                    {item.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {item.description}
                </Typography>
            </Box>
        </Box>
    );
}
