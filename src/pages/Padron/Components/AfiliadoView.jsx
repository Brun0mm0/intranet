import CloseIcon from "@mui/icons-material/Close";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Button,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { calcularEdad, capitalizar, estaVigente, formatCuilTexto, formatDni, formatFecha, limpiarTexto } from "../../../utils/utils";
import EstadoChip from "../../../components/common/EstadoChip";
import { MARINO, tableHeadSx } from "../../../shared-theme/customizations/dataGrid";
import { PARENTESCO_COD } from "../Columns/baseColumns";
import { AportesPanel } from "./AportesList";

const BANNER_BG = "linear-gradient(110deg, #0092c0 0%, #00a9da 45%, #02b57e 100%)";
const SEXO = { M: "Masculino", F: "Femenino" };

const SIN_DATO_SX = { color: "#8a979d", fontStyle: "italic", fontWeight: 400 };

// 🔹 Dato con ícono: etiqueta gris chica, valor principal destacado y un valor secundario debajo.
// Los vacíos se muestran como "Sin dato" en gris, para que no parezcan un error.
function DatoFila({ icon, label, value, secondary, secondaryVacio = "Sin dato" }) {
  const Icon = icon;
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" py={1}>
      <Box
        sx={{
          width: 34, height: 34, borderRadius: 2, flexShrink: 0,
          bgcolor: "#e6f6fb", color: "#0079a0",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box minWidth={0}>
        <Typography variant="caption" sx={{ color: "#56666e", display: "block", lineHeight: 1.4 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.4, ...(value ? {} : SIN_DATO_SX) }}>
          {value || "Sin dato"}
        </Typography>
        {secondary !== undefined && (
          <Typography variant="body2" sx={{ color: "#33434a", ...(secondary ? {} : SIN_DATO_SX) }}>
            {secondary || secondaryVacio}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function Seccion({ title, children }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
        <Box sx={{ width: 8, height: 8, borderRadius: 0.5, bgcolor: "#00a9da" }} />
        <Typography variant="subtitle2" sx={{ color: MARINO, fontWeight: 700 }}>
          {title}
        </Typography>
      </Stack>
      {children}
    </Box>
  );
}

// Franja con los datos que se buscan primero
function DatosClave({ items }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: `repeat(${items.length}, 1fr)` },
        border: 1,
        borderColor: "#e1e8eb",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {items.map(({ label, value }) => (
        <Box key={label} sx={{ px: 2, py: 1.25, borderRight: 1, borderColor: "#e1e8eb", "&:last-of-type": { borderRight: 0 } }}>
          <Typography variant="caption" sx={{ color: "#46565d", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {label}
          </Typography>
          <Typography variant="subtitle1" fontWeight={700}>
            {value ?? "—"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function HistorialTabla({ historial }) {
  if (!Array.isArray(historial) || historial.length === 0) {
    return <Typography color="text.secondary">No hay historial de cobertura.</Typography>;
  }

  const ordenado = [...historial].reverse();

  return (
    <Box sx={{ border: 1, borderColor: "#e1e8eb", borderRadius: 2, overflow: "hidden" }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={tableHeadSx}>
            <TableCell>Plan</TableCell>
            <TableCell>Inicio</TableCell>
            <TableCell>Fin</TableCell>
            <TableCell>Motivo de baja</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ordenado.map((item, index) => {
            const vigente = estaVigente(item.fecha_inicio_cober, item.fecha_fin_cober);
            return (
              <TableRow key={index} hover>
                <TableCell sx={{ fontWeight: 700 }}>{item.plan_cober}</TableCell>
                <TableCell>{formatFecha(item.fecha_inicio_cober)}</TableCell>
                <TableCell>{formatFecha(item.fecha_fin_cober) ?? "—"}</TableCell>
                <TableCell>{limpiarTexto(item.motivo_baja) ?? "—"}</TableCell>
                <TableCell>
                  <EstadoChip estado={vigente ? "vigente" : "neutral"} label={vigente ? "Vigente" : "No vigente"} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}

// 🔹 Detalle del afiliado con pestañas Datos / Historial / Aportes.
// ✅ Antes Aportes abría un segundo modal encima de este; ahora es una pestaña.
export const AfiliadoView = ({
  open,
  handleClose,
  data,
  loading,
  historial,
  onImprimir,
  tab = "datos",
  onTabChange,
  aportes,
  aportesLoading,
}) => {
  const paperSx = { borderRadius: 3, overflow: "hidden" };

  if (loading || !data) {
    return (
      <Dialog maxWidth="lg" fullWidth open={open} onClose={handleClose} slotProps={{ paper: { sx: paperSx } }}>
        <Box sx={{ backgroundImage: BANNER_BG, height: 72, display: "flex", justifyContent: "flex-end", alignItems: "center", px: 2 }}>
          <IconButton onClick={handleClose} sx={{ color: "#fff" }} aria-label="Cerrar"><CloseIcon /></IconButton>
        </Box>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const vigente = estaVigente(data.fecha_inicio_cober, data.fecha_fin_cober);
  const parentesco = PARENTESCO_COD[data.Parentesco_cod] ?? data.Parentesco;
  const inicio = formatFecha(data.fecha_inicio_cober);
  const fin = formatFecha(data.fecha_fin_cober);
  const pendientes = (aportes ?? []).filter((a) => !a.APORTE).length;
  const edad = calcularEdad(data.Fecha_Nac);
  const nacimiento = formatFecha(data.Fecha_Nac) ? `${formatFecha(data.Fecha_Nac)}${edad != null ? ` · ${edad} años` : ""}` : null;

  return (
    <Dialog maxWidth="lg" fullWidth open={open} onClose={handleClose} slotProps={{ paper: { sx: paperSx } }}>
      {/* Encabezado con el mismo degradado que el banner de bienvenida */}
      <Box sx={{ backgroundImage: BANNER_BG, color: "#fff", px: 3, py: 2, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
        <Box minWidth={0}>
          <Typography variant="h5" fontWeight={700} color="inherit">
            {data.Apellido}, {data.Nombre}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.5} mt={0.5} sx={{ opacity: 0.95 }}>
            <Typography variant="body2" color="inherit">N° Afiliado {data.Nro_Afil}</Typography>
            <EstadoChip
              estado={vigente ? "vigente" : "baja"}
              label={vigente ? "Vigente" : "No vigente"}
              sx={{ bgcolor: "#fff" }}
            />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            startIcon={<PrintOutlinedIcon />}
            onClick={() => onImprimir?.(data)}
            sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.6)", bgcolor: "rgba(255,255,255,0.15)", "&:hover": { bgcolor: "rgba(255,255,255,0.25)", borderColor: "#fff" } }}
          >
            Imprimir
          </Button>
          <IconButton onClick={handleClose} aria-label="Cerrar" sx={{ color: "#fff", border: 1, borderColor: "rgba(255,255,255,0.6)", borderRadius: 1.5 }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      <Tabs
        value={tab}
        onChange={(e, value) => onTabChange?.(value)}
        sx={{ px: 2, borderBottom: 1, borderColor: "#e1e8eb", "& .MuiTab-root": { fontWeight: 700, textTransform: "none" } }}
      >
        <Tab value="datos" label="Datos" />
        <Tab value="historial" label="Historial de cobertura" />
        <Tab
          value="aportes"
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <span>Aportes</span>
              {pendientes > 0 && <EstadoChip estado="pendiente" label={`${pendientes} pendiente${pendientes > 1 ? "s" : ""}`} />}
            </Stack>
          }
        />
      </Tabs>

      <DialogContent sx={{ pt: "20px !important", minHeight: 360 }}>
        {tab === "datos" && (
          <Stack spacing={3}>
            <DatosClave
              items={[
                { label: "Plan", value: data.Plan },
                { label: "Cobertura", value: inicio ? (fin ? `${inicio} al ${fin}` : `Desde ${inicio}`) : null },
                { label: "Sucursal", value: capitalizar(data.Sucursal) },
                { label: "Parentesco", value: parentesco },
              ]}
            />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
              <Seccion title="Datos personales">
                <DatoFila
                  icon={BadgeOutlinedIcon}
                  label="CUIL · Documento"
                  value={formatCuilTexto(data.CUIL)}
                  secondary={data.Nro_Doc ? `${data.Tipo_Doc ?? ""} ${formatDni(data.Nro_Doc)}`.trim() : null}
                />
                <DatoFila
                  icon={CalendarMonthOutlinedIcon}
                  label="Nacimiento · Sexo"
                  value={nacimiento}
                  secondary={SEXO[data.Sexo] ?? data.Sexo}
                />
              </Seccion>

              <Seccion title="Cobertura">
                <DatoFila
                  icon={HealthAndSafetyOutlinedIcon}
                  label="Tipo · Zona"
                  value={capitalizar(data.Tipo_cobertura)}
                  secondary={capitalizar(data.Zona)}
                />
                <DatoFila icon={BusinessOutlinedIcon} label="Empresa" value={capitalizar(data.Empresa)} />
              </Seccion>

              <Seccion title="Contacto">
                <DatoFila
                  icon={PhoneOutlinedIcon}
                  label="Teléfono · Celular"
                  value={limpiarTexto(data.telefonos)}
                  secondary={limpiarTexto(data.celular)}
                  secondaryVacio="Celular sin dato"
                />
                <DatoFila icon={EmailOutlinedIcon} label="Email" value={limpiarTexto(data.Email)?.toLowerCase()} />
                <DatoFila
                  icon={HomeOutlinedIcon}
                  label="Domicilio"
                  value={capitalizar(data.Domicilio)}
                  secondary={[capitalizar(data.Localidad), data.CP ? `(${data.CP})` : null].filter(Boolean).join(" ") || null}
                />
              </Seccion>
            </Box>
          </Stack>
        )}

        {tab === "historial" && <HistorialTabla historial={historial} />}

        {tab === "aportes" && <AportesPanel rows={aportes} loading={aportesLoading} />}
      </DialogContent>
    </Dialog>
  );
};
