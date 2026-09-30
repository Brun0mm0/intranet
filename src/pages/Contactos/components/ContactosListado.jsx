import { useMemo, useState } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import PageHeader, { HeaderField, HeaderPills } from "../../../components/common/PageHeader";
import { panelSx } from "../../../shared-theme/customizations/intranetStyles";
import { MARINO } from "../../../shared-theme/customizations/dataGrid";
import { AREAS, areaDe, buscarInternos, TOTAL_INTERNOS } from "../utils/buscarInternos";

const AREAS_VISIBLES = 10;

const CAMPOS = [
    { value: "todos", label: "Todos" },
    { value: "personal", label: "Personal" },
    { value: "piso", label: "Piso" },
    { value: "dependencia", label: "Dependencia" },
];

const PLACEHOLDER = {
    todos: "Buscar por persona, dependencia, piso o interno",
    personal: "Nombre de la persona",
    piso: "Piso, ej. PB, EP, 3",
    dependencia: "Nombre de la dependencia",
};

const chipSx = (activo) => ({
    fontWeight: 700,
    ...(activo && { bgcolor: MARINO, "& .MuiChip-label": { color: "#fff" }, "&:hover": { bgcolor: MARINO } }),
});

export default function ContactosListado() {
    const [busqueda, setBusqueda] = useState("");
    const [campo, setCampo] = useState("todos");
    const [area, setArea] = useState(null);
    const [verTodasAreas, setVerTodasAreas] = useState(false);

    const resultados = useMemo(() => {
        const encontrados = buscarInternos(busqueda, campo);
        return area ? encontrados.filter((c) => areaDe(c) === area) : encontrados;
    }, [busqueda, campo, area]);

    // Las primeras áreas (o todas); el área elegida siempre se ve aunque no esté entre las primeras
    const primeras = AREAS.slice(0, AREAS_VISIBLES);
    const areasMostradas = verTodasAreas
        ? AREAS
        : area && !primeras.some((a) => a.area === area)
            ? [...primeras, ...AREAS.filter((a) => a.area === area)]
            : primeras;

    const hayFiltros = Boolean(busqueda.trim() || area);

    return (
        <Stack spacing={2} flex={1} minHeight={0} width="100%">
            {/* Encabezado institucional: búsqueda */}
            <PageHeader
                icon={<ContactPhoneRoundedIcon />}
                title="Contactos"
                actions={
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.95)", fontWeight: 600, whiteSpace: "nowrap" }}>
                        {resultados.length} de {TOTAL_INTERNOS} internos
                    </Typography>
                }
            >
                <HeaderPills options={CAMPOS} value={campo} onChange={setCampo} />
                <HeaderField
                    id="contactos-busqueda"
                    name="busqueda"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder={PLACEHOLDER[campo]}
                    autoFocus
                />
            </PageHeader>

            <Box sx={{ ...panelSx, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Tags de dependencias, agrupadas por área */}
                <Stack direction="row" alignItems="center" spacing={1} px={2} py={1.25} borderBottom={1} borderColor="#e1e8eb" flexWrap="wrap" useFlexGap>
                    <Chip label={`Todas ${TOTAL_INTERNOS}`} onClick={() => setArea(null)} variant={area ? "outlined" : "filled"} sx={chipSx(!area)} />
                    {areasMostradas.map(({ area: nombre, cantidad }) => (
                        <Chip
                            key={nombre}
                            label={`${nombre} ${cantidad}`}
                            onClick={() => setArea((actual) => (actual === nombre ? null : nombre))}
                            variant={area === nombre ? "filled" : "outlined"}
                            sx={chipSx(area === nombre)}
                        />
                    ))}
                    {AREAS.length > AREAS_VISIBLES && (
                        <Button size="small" onClick={() => setVerTodasAreas((v) => !v)} sx={{ fontWeight: 700, textTransform: "none" }}>
                            {verTodasAreas ? "Ver menos" : `Ver todas (${AREAS.length})`}
                        </Button>
                    )}
                </Stack>

                <Stack spacing={1} flexGrow={1} minHeight={0} sx={{ overflowY: "auto", p: 2 }}>
                    {resultados.map((contacto) => (
                        <ContactoItem key={contacto.id} contacto={contacto} onArea={setArea} />
                    ))}

                    {resultados.length === 0 && (
                        <Stack alignItems="center" spacing={1} pt={4}>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                No se encontraron contactos{busqueda.trim() ? ` para "${busqueda}"` : ""}{area ? ` en ${area}` : ""}.
                            </Typography>
                            {hayFiltros && (
                                <Button size="small" onClick={() => { setBusqueda(""); setArea(null); }} sx={{ textTransform: "none", fontWeight: 700 }}>
                                    Limpiar filtros
                                </Button>
                            )}
                        </Stack>
                    )}
                </Stack>
            </Box>
        </Stack>
    );
}

function ContactoItem({ contacto, onArea }) {
    const area = areaDe(contacto);
    return (
        <Box
            sx={{
                border: 1,
                borderColor: "#e1e8eb",
                borderRadius: 2,
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
                "&:hover": { bgcolor: "#f2f9fc", borderColor: "#cfe6ef" },
            }}
        >
            <Box flexGrow={1} minWidth={0}>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5} flexWrap="wrap" useFlexGap>
                    <Typography variant="subtitle2" fontWeight={700}>{contacto.dependencia}</Typography>
                    {contacto.piso && (
                        <Chip label={contacto.piso} size="small" sx={{ fontWeight: 700, bgcolor: "#e6f6fb", color: "#0079a0", height: 22 }} />
                    )}
                    {/* Tag del área (solo si es una subárea): clic para ver todos los internos del área */}
                    {area !== contacto.dependencia && (
                        <Chip label={area} size="small" variant="outlined" onClick={() => onArea(area)} sx={{ height: 22, fontWeight: 600 }} />
                    )}
                </Stack>
                <Typography variant="body2" sx={{ color: "#46565d" }}>
                    {(contacto.personal ?? []).join(" · ")}
                </Typography>
            </Box>

            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "#0079a0" }} flexShrink={0}>
                <PhoneRoundedIcon fontSize="small" />
                <Typography variant="h6" fontWeight={700} sx={{ fontVariantNumeric: "tabular-nums" }}>{contacto.interno}</Typography>
            </Stack>
        </Box>
    );
}
