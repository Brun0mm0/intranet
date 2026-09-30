import { Box, Typography, Stack, Divider, Link } from "@mui/material";
import { useAccesosRapidos } from "../../hooks/useAccesosRapidos";
import { LINKS_DE_INTERES } from "../../config/linksDeInteres";
import RelojWidget from "../widgets/RelojWidget";
import ClimaWidget from "../widgets/ClimaWidget";
import AccesoRapidoCard from "../linksCard/AccesoRapidoCard";

export default function PanelLateral() {
    const accesibles = useAccesosRapidos();

    return (
        <Box
            width={'15%'}
            display="flex"
            flexDirection="column"
            height="100%"
            border={1}
            borderRadius={2}
            borderColor={'#d1d1d1'}
            p={2}
            pt={6}
            boxShadow={2}
            sx={{
                backgroundImage: 'linear-gradient(325deg, rgba(0,169,218,1) 0%, rgba(175,218,237,0.3) 40%, rgba(196,222,233,0.3) 65%, rgba(2,181,126,1) 100%)',
                }}>
            <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={1}>
                <RelojWidget />
                <ClimaWidget ciudad="buenos-aires" />
            </Stack>

            <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="flex-end" width="100%" pb={2}>
                <Typography variant="subtitle1" mb={1} textAlign="left">
                    Acceso rápido
                </Typography>

                <Stack direction="column" spacing={1} width="100%">
                {accesibles.map((item) => (
                    <AccesoRapidoCard key={item.path} item={item} />
                ))}
                </Stack>

                {accesibles.length === 0 && (
                    <Typography variant="body1" mt={2} textAlign="right">
                        No tienes acceso a ninguna sección del dashboard.
                    </Typography>
                )}
            </Box>
            <Divider/>
            <Stack direction="column" width="100%" pt={2}>
                <Typography variant="subtitle1" mb={1} textAlign="left">
                    Links de interés
                </Typography>
                {LINKS_DE_INTERES.map((item) => (
                    <Link key={item.path} href={item.path} textAlign={"center"} target="_blank" rel="noopener" underline="hover" color="inherit">
                        <Typography variant="body2">
                            {item.label}
                        </Typography>
                    </Link>
                ))}
            </Stack>
        </Box>
    );
}
