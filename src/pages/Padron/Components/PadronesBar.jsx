import {
  Box,
  Button,
  FormControlLabel,
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import useForm from "../../../hooks/useForm";
import { fetchAfiliadoArr } from "../../../store/padrones/thunks";
import { useDispatch } from "react-redux";
import { SearchInput } from "../../../components/inputs/SearchInput";
import { accionButtonSx, panelSx } from "../../../shared-theme/customizations/intranetStyles";
import { useBusquedaAutomatica } from "../hooks/useBusquedaAutomatica";
import { validarInputPadron } from "../../../utils/Validarinputpadron";

const PARAMS_CON_BUSQUEDA_AUTOMATICA = ["apellido", "nombre"];

export default function PadronesBar({ loading }) {
  const dispatch = useDispatch();

  const { values, handleChange, setError, errors } = useForm({
    param: "dni",
    plan: "",
    value: "",
  });

  const esBusquedaAutomatica = PARAMS_CON_BUSQUEDA_AUTOMATICA.includes(values.param);

  // ✅ Apellido y Nombre ahora buscan solas (sin botón): al llegar a 2
  // caracteres se dispara la búsqueda al backend con una pausa breve
  // (debounce), y agregando una coma se puede filtrar el resultado por el
  // campo complementario sin golpear la API de nuevo — ej: "pr,br".
  // Toda esa lógica vive en el hook, acá solo se activa.
  useBusquedaAutomatica({ activo: esBusquedaAutomatica, param: values.param, value: values.value });

  const handleRadioChange = (e) => {
    handleChange(e);
  };

  const handleInputChange = (e) => {
    let value = e.target.value;

  handleChange({
      target: {
        name: e.target.name,
        value,
      },
    });

    if (errors.value) {
      setError("value", null);
    }
  };

  const handleBuscar = () => {
    // ✅ Apellido/Nombre ya se manejan solos con el hook de arriba —
    // el submit manual queda reservado para el resto de las opciones.
    if (esBusquedaAutomatica) return;

    const error = validarInputPadron(values.value, values.param, values.plan);

    if (error) {
      setError("value", error);
      return;
    }

    dispatch(fetchAfiliadoArr(values));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBuscar();
  };

  return (
    <AnimatePresence>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          ...panelSx,
          py: 1,
          px: 2,
        }}
      >
        <motion.div
          key="simple"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3 }}
          style={{ width: "100%" }}
        >
          <Box width={"100%"} display={"flex"}>
            <Stack direction="column" spacing={1} flexGrow={1}>
              <FormControl component="fieldset">
                <FormLabel id="padrones-bar-label-params">
                  Buscar Afiliado
                </FormLabel>

                <RadioGroup
                  row
                  aria-labelledby="padrones-bar-label-params"
                  value={values.param}
                  onChange={handleRadioChange}
                  name="param"
                  sx={{ px: 0 }}
                >
                  <FormControlLabel value="dni" control={<Radio size="small" />} label="DNI" />
                  <FormControlLabel value="cuil" control={<Radio size="small" />} label="CUIL" />
                  <FormControlLabel value="Nro_Afil" control={<Radio size="small" />} label="N de Afiliado" />
                  <FormControlLabel value="apellido" control={<Radio size="small" />} label="Apellido" />
                  <FormControlLabel value="nombre" control={<Radio size="small" />} label="Nombre" />
                </RadioGroup>
              </FormControl>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                paddingRight: 2,
              }}
            >
              <FormControl variant="outlined" error={Boolean(errors.value)}>
                <SearchInput
                  name="value"
                  value={values.value}
                  onChange={handleInputChange}
                  placeholder={
                    esBusquedaAutomatica
                      ? `Ej: pr,br (${values.param} + filtro)`
                      : undefined
                  }
                />
                <FormHelperText>
                  {errors.value ??
                    (esBusquedaAutomatica
                      ? "Escribí 2+ letras para buscar. Agregá una coma para filtrar por el otro campo."
                      : null)}
                </FormHelperText>
              </FormControl>
            </Stack>
          </Box>
        </motion.div>

        {!esBusquedaAutomatica && (
          <Stack direction={"row"} spacing={1}>
            <Button
              type="submit"
              sx={accionButtonSx}
              size="large"
              variant="outlined"
              loading={loading}
            >
              Buscar
            </Button>
          </Stack>
        )}
      </Box>
    </AnimatePresence>
  );
}