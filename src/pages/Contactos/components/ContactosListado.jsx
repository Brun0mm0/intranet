import { useMemo, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Chip,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { SearchInput } from "../../../components/inputs/SearchInput";
import internos from "../../../data/internos.json";

const CAMPOS = [
    { value: "todos", label: "Todos" },
    { value: "personal", label: "Personal" },
    { value: "piso", label: "Piso" },
    { value: "dependencia", label: "Dependencia" },
];

// Minúsculas y sin acentos, para que "recepcion" encuentre "Recepción"
const normalizar = (texto) =>
    (texto ?? "").toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const valoresDeCampo = (contacto, campo) => {
    switch (campo) {
        case "personal":
            return contacto.personal ?? [];
        case "piso":
            return [contacto.piso];
        case "dependencia":
            return [contacto.dependencia];
        default:
            return [contacto.dependencia, contacto.piso, contacto.interno, ...(contacto.personal ?? [])];
    }
};

export default function ContactosListado() {
    const [busqueda, setBusqueda] = useState("");
    const [campo, setCampo] = useState("todos");

    const resultados = useMemo(() => {
        const termino = normalizar(busqueda.trim());
        if (!termino) return internos;
        return internos.filter((contacto) =>
            valoresDeCampo(contacto, campo).some((valor) => normalizar(valor).includes(termino))
        );
    }, [busqueda, campo]);

    return (
        <Box height="100%" display="flex" flexDirection="column" width="100%" minHeight={0}>
            <Typography variant="h4" gutterBottom>
                Contactos
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} pb={2}>
                <FormControl component="fieldset">
                    <FormLabel id="contactos-label-campo">Buscar por</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="contactos-label-campo"
                        value={campo}
                        onChange={(e) => setCampo(e.target.value)}
                        name="campo"
                    >
                        {CAMPOS.map((c) => (
                            <FormControlLabel key={c.value} value={c.value} control={<Radio size="small" />} label={c.label} />
                        ))}
                    </RadioGroup>
                </FormControl>

                <SearchInput
                    name="busqueda"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar contacto"
                />
            </Stack>

            <Typography variant="caption" color="text.secondary" pb={1}>
                {resultados.length} de {internos.length} internos
            </Typography>

            <Stack spacing={1} flexGrow={1} minHeight={0} sx={{ overflowY: "auto", pr: 1 }}>
                {resultados.map((contacto) => (
                    <ContactoItem key={contacto.id} contacto={contacto} />
                ))}

                {resultados.length === 0 && (
                    <Typography variant="body2" color="text.secondary" textAlign="center" pt={4}>
                        No se encontraron contactos para "{busqueda}".
                    </Typography>
                )}
            </Stack>
        </Box>
    );
}

function ContactoItem({ contacto }) {
    return (
        <Box
            sx={{
                bgcolor: "action.hover",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
            }}
        >
            <Box flexGrow={1} minWidth={0}>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                    <Typography variant="subtitle2">{contacto.dependencia}</Typography>
                    {contacto.piso && <Chip label={contacto.piso} size="small" variant="outlined" />}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    {(contacto.personal ?? []).join(" · ")}
                </Typography>
            </Box>

            <Stack direction="row" spacing={0.5} alignItems="center" color="primary.main" flexShrink={0}>
                <PhoneRoundedIcon fontSize="small" />
                <Typography variant="h6">{contacto.interno}</Typography>
            </Stack>
        </Box>
    );
}
