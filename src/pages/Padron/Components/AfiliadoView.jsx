import CloseIcon from "@mui/icons-material/Close";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import { estaVigente } from "../../../utils/utils";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Chip,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

// 🔹 Par etiqueta/valor en texto plano.
// ✅ Contraste: antes usaba "text.secondary" (gris muy claro) — ahora
// grey.700 + bold, que se lee bien incluso a tamaño chico.
function Field({ label, value }) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: "grey.700",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontWeight: 700,
          fontSize: "0.7rem",
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.25, color: "text.primary" }}>
        {value ?? "—"}
      </Typography>
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
        height: "100%",
        bgcolor: "grey.50",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1.5, color: "primary.dark", fontWeight: 700 }}>
        {title}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
        {children}
      </Box>
    </Box>
  );
}

function HistorialTabla({ historial }) {
  if (!Array.isArray(historial) || historial.length === 0) {
    return <Typography color="text.secondary">No hay historial de cobertura.</Typography>;
  }

  const ordenado = [...historial].reverse();

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 700 }}>Plan</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Inicio</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Fin</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Motivo de baja</TableCell>
          <TableCell align="right" sx={{ fontWeight: 700 }}>Estado</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ordenado.map((item, index) => {
          // ✅ Antes: `!item.fecha_fin_cober` solo miraba si el campo existía,
          // sin comparar contra la fecha actual — una cobertura con fecha de
          // fin ya vencida igual se marcaba como "Vigente". Ahora usa la
          // misma función compartida que el resto de la app (utils.js).
          const vigente = estaVigente(item.fecha_inicio_cober, item.fecha_fin_cober);
          return (
            <TableRow key={index}>
              <TableCell>{item.plan_cober}</TableCell>
              <TableCell>{item.fecha_inicio_cober}</TableCell>
              <TableCell>{item.fecha_fin_cober ?? "—"}</TableCell>
              <TableCell>{item.motivo_baja ?? "—"}</TableCell>
              <TableCell align="right">
                <Chip
                  label={vigente ? "Vigente" : "No vigente"}
                  color={vigente ? "success" : "default"}
                  size="small"
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export const AfiliadoView = ({
  open,
  handleClose,
  data,
  loading,
  historial,
  onImprimir,
  onVerAportes,
}) => {

  if (loading || !data) {
    return (
      <Dialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
        <DialogTitle sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const vigente = estaVigente(data.fecha_inicio_cober, data.fecha_fin_cober);

  return (
    <Dialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {data.Apellido}, {data.Nombre}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                N° Afiliado {data.Nro_Afil}
              </Typography>
              <Chip
                label={vigente ? "Vigente" : "No vigente"}
                color={vigente ? "success" : "default"}
                size="small"
              />
            </Box>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {/* ✅ Acciones agregadas al modal, antes solo disponibles desde
                el menú de la fila en la grilla. */}
            <Button
              size="small"
              variant="outlined"
              startIcon={<PrintOutlinedIcon />}
              onClick={() => onImprimir?.(data)}
            >
              Imprimir
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<PriceCheckOutlinedIcon />}
              onClick={() => {
                // ✅ El CUIL no lleva ningún código pegado al final — se usa
                // tal cual viene del backend, sin recortar.
                onVerAportes?.(data.Cuil_titular ?? data.CUIL);
              }}
            >
              Aportes
            </Button>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          <Section title="Datos personales">
            <Field label="CUIL" value={data.CUIL} />
            <Field label="Sexo" value={data.Sexo} />
            <Field label="Tipo y N° Doc." value={`${data.Tipo_Doc ?? ""} ${data.Nro_Doc ?? ""}`.trim()} />
            <Field label="Fecha de nacimiento" value={data.Fecha_Nac} />
            <Field label="Parentesco" value={data.Parentesco} />
          </Section>

          <Section title="Cobertura">
            <Field label="Plan" value={data.Plan} />
            <Field label="Tipo de cobertura" value={data.Tipo_cobertura} />
            <Field label="Inicio" value={data.fecha_inicio_cober} />
            <Field label="Fin" value={data.fecha_fin_cober ?? "actualidad"} />
            <Field label="Sucursal" value={data.Sucursal} />
            <Field label="Zona" value={data.Zona} />
            <Field label="Empresa" value={data.Empresa} />
          </Section>

          <Section title="Contacto">
            <Field label="Teléfono" value={data.telefonos} />
            <Field label="Celular" value={data.celular} />
            <Field label="Email" value={data.Email} />
            <Field label="Domicilio" value={data.Domicilio} />
            <Field label="Localidad" value={data.Localidad} />
            <Field label="CP" value={data.CP} />
          </Section>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1, color: "primary.dark", fontWeight: 700 }}>
          Historial de cobertura
        </Typography>
        <HistorialTabla historial={historial} />
      </DialogContent>
    </Dialog>
  );
};