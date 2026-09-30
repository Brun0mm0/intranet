import { Box, CircularProgress, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import EstadoChip from "../../../components/common/EstadoChip";
import { formatCuilTexto } from "../../../utils/utils";
import { tableHeadSx } from "../../../shared-theme/customizations/dataGrid";

function Kpi({ label, value, destacado }) {
    return (
        <Box
            sx={{
                flex: 1,
                border: 1,
                borderColor: destacado ? "#f0d58a" : "#e1e8eb",
                bgcolor: destacado ? "#fffaeb" : "background.paper",
                borderRadius: 2,
                px: 2,
                py: 1.25,
            }}
        >
            <Typography variant="caption" sx={{ color: "#46565d", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {label}
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ fontVariantNumeric: "tabular-nums" }}>
                {value}
            </Typography>
        </Box>
    );
}

// 🔹 Contenido de la pestaña Aportes del detalle del afiliado.
// ✅ Antes era un segundo modal apilado sobre el detalle, con filas enteras en
// amarillo/verde + etiqueta + leyenda. Ahora: resumen arriba y solo etiquetas de estado.
// Los aportes vienen ordenados del más reciente al más viejo (ver fetchAportes).
export const AportesPanel = ({ rows = [], loading }) => {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
            </Box>
        );
    }

    if (rows.length === 0) {
        return (
            <Stack alignItems="center" justifyContent="center" minHeight={200}>
                <Typography color="text.secondary">No hay aportes disponibles para este afiliado.</Typography>
            </Stack>
        );
    }

    const pendientes = rows.filter((r) => !r.APORTE);
    const acreditados = rows.filter((r) => r.APORTE);

    return (
        <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Kpi
                    label={pendientes.length === 1 ? "Período pendiente" : "Períodos pendientes"}
                    value={pendientes.length ? pendientes.map((r) => r.Periodo).join(" · ") : "Ninguno"}
                    destacado={pendientes.length > 0}
                />
                <Kpi label="Acreditados" value={`${acreditados.length} de ${rows.length} períodos`} />
                <Kpi label="Último acreditado" value={acreditados[0]?.Periodo ?? "—"} />
            </Stack>

            <Box sx={{ border: 1, borderColor: "#e1e8eb", borderRadius: 2, overflow: "hidden" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={tableHeadSx}>
                            <TableCell>Período</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Prestadora</TableCell>
                            <TableCell>CUIT empleador</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow key={row.ID ?? i} hover>
                                <TableCell sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{row.Periodo}</TableCell>
                                <TableCell>
                                    <EstadoChip
                                        estado={row.APORTE ? "vigente" : "pendiente"}
                                        label={row.APORTE ? "Acreditado" : "Pendiente"}
                                    />
                                </TableCell>
                                <TableCell>{row.Prestadora ?? "—"}</TableCell>
                                <TableCell sx={{ fontVariantNumeric: "tabular-nums" }}>{formatCuilTexto(row.CUIT) ?? "—"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Stack>
    );
};
