
import CloseIcon from "@mui/icons-material/Close";
import {ReadOnlyOutlinedField} from "../../../components/forms/ReadOnlyOutlinedField";
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    Box,
    Stack,
    TextField,
    Grid
    } from "@mui/material";



export const AfiliadoView = ({ open, handleClose, data, shouldRenderField, historial }) => {

const estaVigente = (fecha) => {
  if (!fecha) return true;

  // formato argentino DD/MM/YYYY
  const [day, month, year] = fecha.split('/').map(Number);

  const f = new Date(year, month - 1, day);
  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);
  f.setHours(0, 0, 0, 0);

  return f >= hoy;
}

  const historialFields = [
  {
    key: "plan_cober",
    label: "Plan",
    size: 6,
  },
  {
    key: "motivo_baja",
    label: "Motivo de baja",
    size: 12,
    hideIf: (item) => !item.motivo_baja,
  },
  {
    key: "fecha_inicio_cober",
    label: "Inicio cobertura",
    size: 6,
  },
  {
    key: "fecha_fin_cober",
    label: "Fin cobertura",
    size: 6,
  },
];

  return (
     <Dialog maxWidth="xl" open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography fontWeight={600} fontSize="1.2rem">
          {data.Apellido}, {data.Nombre} - N°Afiliado: {data.Nro_Afil}
        </Typography>
        <IconButton
          edge="end"
          onClick={handleClose}
          sx={{ position: "absolute", right: 20, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} marginBottom={3}>
          {/* Izquierda */}
          <Grid item size={9}>
            <Grid container>
            <Grid item xl={12}>
            <Typography variant="subtitle1"  marginBottom={2}>
              Detalles del afiliado:
            </Typography>
            </Grid>

            <Grid item md={6} bgcolor={'#e4e4e4ff'} borderRadius={2} padding={2}>
              <Grid container spacing={3} marginBottom={3}>
                <Grid item size={2}>
                  <ReadOnlyOutlinedField
                    id="nro-afiliado"
                    label="N° Afiliado"
                    value={data.Nro_Afil} />
                </Grid>
                <Grid item size={1}>
                    <ReadOnlyOutlinedField
                      id="parentesco"
                      label="Parentesco"
                      value={data.Parentesco} />
                </Grid>
                <Grid item size={1}>
                    <ReadOnlyOutlinedField
                      id="plan"
                      label="Plan"
                      value={data.Plan} />
                </Grid>
                <Grid item size={2}>
                    <ReadOnlyOutlinedField
                      id="tipo-cobertura"
                      label="Tipo de Cobertura"
                      value={data.Tipo_cobertura} />
                </Grid>
                <Grid item size={6}>
                    <ReadOnlyOutlinedField
                      id="vigencia"
                      label="Vigencia"
                      value={`Desde: ${data.fecha_inicio_cober} - Hasta: ${ data.fecha_fin_cober === null ? '—' : data.fecha_fin_cober}`} />
                </Grid>
              </Grid>
              <Grid container spacing={3} marginBottom={3} >
                  <Grid item size={5}>
                    <ReadOnlyOutlinedField
                      id="apellido-nombre"
                      label="Apellido y Nombre"
                      value={`${data.Apellido}, ${data.Nombre}`} />
                  </Grid>
                  <Grid item size={2}>
                    <ReadOnlyOutlinedField
                      id="cuil"
                      label="CUIL"
                      value={data.CUIL} />
                  </Grid>
                  <Grid item size={3}>
                    <ReadOnlyOutlinedField
                      id="tipo-y-nro-documento"
                      label="Tipo y N° de Documento"
                      value={`${data.Tipo_Doc} ${data.Nro_Doc}`} />
                  </Grid>
                  <Grid item size={2}>
                    <ReadOnlyOutlinedField
                      id="fecha-nacimiento"
                      label="Fecha de Nacimiento"
                      value={data.Fecha_Nac} />
                  </Grid>
              </Grid>
              <Grid container spacing={3} marginBottom={3}>
                  <Grid item size={3}>
                    <ReadOnlyOutlinedField
                      id="telefono"
                      label="Telefono"
                      value={data.telefonos} />
                  </Grid>
                  <Grid item size={3}>
                    <ReadOnlyOutlinedField
                      id="celular"
                      label="Celular"
                      value={data.celular ? data.celular : '—'} />
                  </Grid>
                  <Grid item size={6}>
                    <ReadOnlyOutlinedField
                      id="email"
                      label="Email"
                      value={data.Email} />
                  </Grid>
              </Grid>
              <Grid container spacing={3} marginBottom={3}>
                  <Grid item size={6}>
                    <ReadOnlyOutlinedField
                      id="domicilio"
                      label="Domicilio"
                      value={data.Domicilio} />
                  </Grid>
                  <Grid item size={4}>
                    <ReadOnlyOutlinedField
                      id="localidad"
                      label="Localidad"
                      value={data.Localidad} />
                  </Grid>
                  <Grid item size={2}>
                    <ReadOnlyOutlinedField
                      id="cp"
                      label="CP"
                      value={data.CP} />
                  </Grid>
              </Grid>
              <Grid container spacing={3} marginBottom={3}>
                  <Grid item size={6}>
                    <ReadOnlyOutlinedField
                      id="sucursal"
                      label="Sucursal"
                      value={data.Sucursal} />
                  </Grid>
                  <Grid item size={6}>
                    <ReadOnlyOutlinedField
                      id="zona"
                      label="Zona"
                      value={data.Zona} />
                  </Grid>
                  <Grid item size={6}>
                    <ReadOnlyOutlinedField
                      id="empresa"
                      label="Empresa"
                      value={data.Empresa} />
                  </Grid>
              </Grid>
            </Grid>
          </Grid>
            </Grid>
          
          <Grid item size={3}>
            <Typography variant="subtitle1" marginBottom={2}>Historial de Cobertura:</Typography>
          <Grid item xs={12} md={4}>
              <Box
                 sx={{
                   maxHeight: '56vh', // altura máxima que quieras
                   overflowY: 'auto',
                   pr: 1, // padding derecho para que no se corte el scroll
                 }}
                 borderRadius={2}
                 >
            {Array.isArray(historial) && historial.length > 0 ? (
              [...historial]
              .reverse()
              .map((item, index) => (
                <Grid
                  key={index}
                  container
                  spacing={2}
                  padding={2}
                  mb={3}
                  borderRadius={2}
                  bgcolor={estaVigente(item.fecha_fin_cober) ? "#bddab1ff" : "#e4e4e4ff"}
                >
                      {historialFields
                        .filter(({ hideIf }) => !(hideIf && hideIf(item)))
                        .map(({ key, label, size }) => (
                          <Grid item key={key} size={size}>
                            <ReadOnlyOutlinedField
                              label={label}
                              value={
                                item[key] ??
                                (key === "fecha_fin_cober" ? "Vigente" : "— —")
                              }
                            />
                          </Grid>
                        ))}
                  </Grid>
              ))
            ) : (
              <Typography>No hay historial</Typography>
            )}
              </Box>
          </Grid>
          </Grid>
          </Grid>
          </DialogContent>
    </Dialog>
  )
}
