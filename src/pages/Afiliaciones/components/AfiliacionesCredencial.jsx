import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { useDispatch, useSelector } from "react-redux";
import { fetchCredenciales } from "../../../store/afiliaciones/thunks";
import { SearchInput } from "../../../components/inputs/SearchInput";
import { MARINO } from "../../../shared-theme/customizations/dataGrid";

const BANNER_BG = "linear-gradient(110deg, #0092c0 0%, #00a9da 45%, #02b57e 100%)";

// El DNI se acepta con o sin puntos ("31.402.118"); se valida y envía solo con dígitos.
const validarDni = (texto) => {
    const digitos = texto.replace(/\D/g, "");
    if (!texto.trim()) return { digitos, error: null };
    if (/[^\d\s.]/.test(texto)) return { digitos, error: "Escribí solo números." };
    if (digitos.length < 3 || digitos.length > 8) return { digitos, error: "El DNI tiene hasta 8 dígitos." };
    return { digitos, error: null };
};

// 🔹 Descarga de credencial con el mismo estilo que el buscador del Padrón
// (degradado del banner, campo blanco, botón marino y ayuda debajo del campo).
export const AfiliacionesCredencial = () => {
    const { loading } = useSelector((state) => state.afiliaciones);
    const dispatch = useDispatch();

    const [dni, setDni] = useState("");
    const [intentoEnviar, setIntentoEnviar] = useState(false);

    const { digitos, error } = validarDni(dni);
    const listo = digitos.length > 0 && !error;
    // El error de formato se muestra mientras se escribe; el de "vacío" solo al intentar descargar
    const mensaje = error ?? (intentoEnviar && !digitos ? "Ingresá el DNI del afiliado." : null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIntentoEnviar(true);
        if (!listo) return;
        await dispatch(fetchCredenciales({ dni: digitos }));
        setDni("");
        setIntentoEnviar(false);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: "100%",
                backgroundImage: BANNER_BG,
                borderRadius: 3,
                px: 2.5,
                pt: 1.5,
                pb: 2.5, // lugar fijo para el mensaje de ayuda debajo del campo
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 2.5,
                flexWrap: "wrap",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.25} flex={1} minWidth={260}>
                <BadgeRoundedIcon />
                <Box minWidth={0}>
                    <Typography variant="h6" fontWeight={700} color="inherit" lineHeight={1.3}>
                        Descargar credencial
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.92)" }}>
                        Ingresá el DNI del afiliado para descargar su credencial en PDF.
                    </Typography>
                </Box>
            </Stack>

            <Box width={{ xs: "100%", sm: 320 }} position="relative">
                <SearchInput
                    name="dni"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Número de DNI"
                    autoFocus
                    sx={{ width: "100%", bgcolor: "#fff", borderRadius: 2, pr: 0 }}
                    inputProps={{ inputMode: "numeric", "aria-describedby": "credencial-ayuda", "aria-invalid": Boolean(mensaje) }}
                />
                {mensaje && (
                    <Typography
                        id="credencial-ayuda"
                        variant="caption"
                        sx={{ position: "absolute", left: 4, top: "100%", mt: 0.25, color: "#fff", fontWeight: 600, whiteSpace: "nowrap", lineHeight: 1.3 }}
                    >
                        {mensaje}
                    </Typography>
                )}
            </Box>

            <Button
                type="submit"
                size="large"
                loading={loading}
                disabled={Boolean(error)}
                sx={{
                    bgcolor: MARINO,
                    color: "#fff",
                    fontWeight: 700,
                    px: 3.5,
                    border: 0,
                    "&:hover": { bgcolor: "#082c3b" },
                    "&.Mui-disabled": { bgcolor: "rgba(11,59,79,0.45)", color: "rgba(255,255,255,0.75)" },
                }}
            >
                Descargar
            </Button>
        </Box>
    );
};
