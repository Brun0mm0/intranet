import { useState } from "react";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { useDispatch, useSelector } from "react-redux";
import { fetchCredenciales } from "../../../store/afiliaciones/thunks";
import PageHeader, { HeaderButton, HeaderField } from "../../../components/common/PageHeader";

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
        <PageHeader
            component="form"
            onSubmit={handleSubmit}
            icon={<BadgeRoundedIcon />}
            title="Descargar credencial"
            subtitle="Ingresá el DNI del afiliado para descargar su credencial en PDF."
            sx={{ width: "100%" }}
            // Campo y botón juntos a la derecha
            actions={
                <>
                    <HeaderField
                        id="credencial-dni"
                        name="dni"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        placeholder="Número de DNI"
                        autoFocus
                        helperText={mensaje}
                        // Ancho fijo (no flex-basis): así el grupo de acciones reserva lugar también para el botón
                        boxSx={{ flex: "none", width: { xs: 220, sm: 320 }, minWidth: 0 }}
                        inputProps={{ inputMode: "numeric", "aria-invalid": Boolean(mensaje) }}
                    />
                    <HeaderButton type="submit" loading={loading} disabled={Boolean(error)}>
                        Descargar
                    </HeaderButton>
                </>
            }
        />
    );
};
