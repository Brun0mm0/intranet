import { Box, Button, Chip, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import BannerBienvenida from "../components/dashboard/BannerBienvenida";
import DashboardCard from "../components/dashboard/DashboardCard";
import AccesosRapidosGrid from "../components/dashboard/AccesosRapidosGrid";
import ContactosResumen from "../components/dashboard/ContactosResumen";
import MensajeriaPanel from "../components/dashboard/MensajeriaPanel";
import { LINKS_DE_INTERES } from "../config/linksDeInteres";
import { TOTAL_INTERNOS } from "./Contactos/utils/buscarInternos";

// Bento: banner de marca arriba y bloques planos debajo, sin capas superpuestas.
export default function DashboardIndexPage() {
    return (
        <Box
            component="section"
            width="100%"
            flexGrow={1}
            minHeight={0}
            display="grid"
            gap={2}
            sx={{
                overflowY: { xs: "auto", md: "hidden" },
                gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                gridTemplateRows: { xs: "auto", md: "auto 1fr 1fr auto" },
                gridTemplateAreas: {
                    xs: `"banner" "accesos" "novedades" "contactos" "links"`,
                    md: `"banner banner banner banner"
                         "novedades novedades accesos accesos"
                         "novedades novedades contactos contactos"
                         "links links links links"`,
                },
            }}
        >
            <BannerBienvenida sx={{ gridArea: "banner" }} />

            <DashboardCard title="Novedades" sx={{ gridArea: "novedades" }}>
                <MensajeriaPanel />
            </DashboardCard>

            <DashboardCard title="Acceso rápido" sx={{ gridArea: "accesos" }}>
                <AccesosRapidosGrid />
            </DashboardCard>

            <DashboardCard
                title="Contactos"
                sx={{ gridArea: "contactos" }}
                action={
                    <Button component={RouterLink} to="/contactos" size="small">
                        Ver los {TOTAL_INTERNOS} internos
                    </Button>
                }
            >
                <ContactosResumen />
            </DashboardCard>

            <DashboardCard sx={{ gridArea: "links", py: 1.5 }}>
                <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
                    <Box component="span" sx={{ fontWeight: 700, mr: 1 }}>Links de interés</Box>
                    {LINKS_DE_INTERES.map((item) => (
                        <Chip
                            key={item.path}
                            label={item.label}
                            component="a"
                            href={item.path}
                            target="_blank"
                            rel="noopener"
                            clickable
                            variant="outlined"
                            icon={<OpenInNewRoundedIcon fontSize="small" />}
                        />
                    ))}
                </Stack>
            </DashboardCard>
        </Box>
    );
}
