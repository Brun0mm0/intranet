import { Box, Button, ButtonBase, Stack, Typography } from "@mui/material";
import { SearchInput } from "../inputs/SearchInput";
import { BANNER_BG, PAGE_HEADER_HEIGHT } from "../../shared-theme/customizations/intranetStyles";
import { MARINO } from "../../shared-theme/customizations/dataGrid";

// 🔹 Encabezado de página con el degradado institucional y altura común (88 px) en todas las pantallas.
// Cada página pone sus controles como children (pastillas, campo, textos) y sus botones en `actions`.
// Con `component="form"` + `onSubmit` el encabezado funciona como formulario (Enter busca).
export default function PageHeader({ icon, title, subtitle, children, actions, sx, ...props }) {
    return (
        <Box
            sx={{
                backgroundImage: BANNER_BG,
                color: "#fff",
                borderRadius: 3,
                px: 2.5,
                py: { xs: 1.5, md: 0 },
                // Fija en escritorio; en pantallas angostas es mínima para que los controles bajen de fila
                height: { md: PAGE_HEADER_HEIGHT },
                minHeight: PAGE_HEADER_HEIGHT,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 2.5,
                flexWrap: { xs: "wrap", md: "nowrap" },
                ...sx,
            }}
            {...props}
        >
            {(icon || title) && (
                <Stack direction="row" alignItems={subtitle ? "flex-start" : "center"} spacing={1.25} flexShrink={subtitle ? 1 : 0} minWidth={0}>
                    {icon && <Box sx={{ display: "flex", mt: subtitle ? 0.25 : 0 }}>{icon}</Box>}
                    <Box minWidth={0}>
                        <Typography variant="h6" fontWeight={700} color="inherit" noWrap lineHeight={1.3}>
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.92)" }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            )}

            {children}

            {actions && (
                <Stack direction="row" spacing={1} alignItems="center" flexShrink={0} sx={{ ml: "auto" }}>
                    {actions}
                </Stack>
            )}
        </Box>
    );
}

// 🔹 Pastillas para elegir el tipo de búsqueda (dentro de un PageHeader)
export function HeaderPills({ options, value, onChange, label = "Buscar por", titleForActive }) {
    return (
        <Stack
            direction="row"
            role="radiogroup"
            aria-label={label}
            sx={{ bgcolor: "rgba(255,255,255,0.18)", borderRadius: 99, p: 0.5, gap: 0.25, flexShrink: 0 }}
        >
            {options.map((o) => {
                const activo = value === o.value;
                return (
                    <ButtonBase
                        key={o.value}
                        role="radio"
                        aria-checked={activo}
                        onClick={() => onChange(o.value)}
                        title={activo ? titleForActive : undefined}
                        sx={{
                            px: 1.75,
                            py: 0.75,
                            borderRadius: 99,
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            whiteSpace: "nowrap",
                            color: activo ? "#0079a0" : "#fff",
                            bgcolor: activo ? "#fff" : "transparent",
                            transition: "background-color 120ms",
                            "&:hover": { bgcolor: activo ? "#fff" : "rgba(255,255,255,0.2)" },
                            "&.Mui-focusVisible": { outline: "2px solid #fff", outlineOffset: 2 },
                        }}
                    >
                        {o.label}
                    </ButtonBase>
                );
            })}
        </Stack>
    );
}

// 🔹 Campo de búsqueda blanco con mensaje de ayuda debajo. El mensaje ocupa el espacio
// reservado del encabezado, así que aparecer o desaparecer no cambia la altura.
export function HeaderField({ helperText, id, boxSx, inputProps, ...props }) {
    const ayudaId = id ? `${id}-ayuda` : undefined;
    return (
        <Box flex={1} minWidth={240} position="relative" sx={boxSx}>
            <SearchInput
                id={id}
                sx={{ width: "100%", bgcolor: "#fff", borderRadius: 2, pr: 0 }}
                inputProps={{ ...(helperText && ayudaId ? { "aria-describedby": ayudaId } : {}), ...inputProps }}
                {...props}
            />
            {helperText && (
                <Typography
                    id={ayudaId}
                    variant="caption"
                    sx={{ position: "absolute", left: 4, top: "100%", mt: 0.25, color: "#fff", fontWeight: 600, whiteSpace: "nowrap", lineHeight: 1.3 }}
                >
                    {helperText}
                </Typography>
            )}
        </Box>
    );
}

// 🔹 Botón del encabezado: marino (acción principal) o blanco (acción secundaria, ej. "Nuevo usuario")
export function HeaderButton({ variante = "marino", sx, ...props }) {
    const marino = variante === "marino";
    return (
        <Button
            size="large"
            sx={{
                fontWeight: 700,
                textTransform: "none",
                px: 3,
                border: 0,
                whiteSpace: "nowrap",
                bgcolor: marino ? MARINO : "#fff",
                color: marino ? "#fff" : "#0079a0",
                "&:hover": { bgcolor: marino ? "#082c3b" : "#eaf7fc" },
                "&.Mui-disabled": marino
                    ? { bgcolor: "rgba(11,59,79,0.45)", color: "rgba(255,255,255,0.75)" }
                    : { bgcolor: "rgba(255,255,255,0.6)", color: "rgba(0,121,160,0.6)" },
                ...sx,
            }}
            {...props}
        />
    );
}
