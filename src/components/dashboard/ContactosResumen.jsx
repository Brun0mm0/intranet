import { useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { SearchInput } from "../inputs/SearchInput";
import { buscarInternos } from "../../pages/Contactos/utils/buscarInternos";

const MAX_RESULTADOS = 5;

// Búsqueda rápida de internos en el inicio; el listado completo está en /contactos.
export default function ContactosResumen() {
    const [busqueda, setBusqueda] = useState("");
    const resultados = useMemo(
        () => (busqueda.trim() ? buscarInternos(busqueda).slice(0, MAX_RESULTADOS) : []),
        [busqueda]
    );

    return (
        <Box display="flex" flexDirection="column" gap={1} minHeight={0}>
            <SearchInput
                name="busqueda-interno"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar interno, persona o piso"
                size="small"
            />

            <Stack sx={{ overflowY: "auto", minHeight: 0 }}>
                {!busqueda.trim() && (
                    <Typography variant="body2" color="text.secondary" pt={1}>
                        Escribí un nombre, una dependencia o un piso.
                    </Typography>
                )}
                {busqueda.trim() && resultados.length === 0 && (
                    <Typography variant="body2" color="text.secondary" pt={1}>
                        Sin resultados para "{busqueda}".
                    </Typography>
                )}
                {resultados.map((c) => (
                    <Stack
                        key={c.id}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        py={0.75}
                        sx={{ borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } }}
                    >
                        <Box minWidth={0}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                                {c.dependencia}{c.piso ? ` · ${c.piso}` : ""}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap display="block">
                                {(c.personal ?? []).join(" · ")}
                            </Typography>
                        </Box>
                        <Stack direction="row" alignItems="center" spacing={0.5} color="primary.main" flexShrink={0}>
                            <PhoneRoundedIcon fontSize="small" />
                            <Typography variant="body1" fontWeight={700}>{c.interno}</Typography>
                        </Stack>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}
