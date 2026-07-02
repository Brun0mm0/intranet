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
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import useForm from "../../../hooks/useForm";
import { fetchAfiliadoArr } from "../../../store/padrones/thunks";
import { useDispatch } from "react-redux";
import { SearchInput } from "../../../components/inputs/SearchInput";

export default function PadronesBar({ loading }) {
  const dispatch = useDispatch();

  const { values, handleChange, setError, errors } = useForm({
    param: "dni",
    plan: "",
    value: "",
  });

  function validarInput(valor, tipo, plan) {
    const cleanValue = valor.replace(/\D/g, "");

    if (!valor && !plan) return "Este campo es obligatorio";

    if (tipo === "dni" && !plan) {
      return /^\d{7,8}$/.test(cleanValue)
        ? null
        : "El DNI debe tener 7 u 8 dígitos";
    }

    if (tipo === "cuil") {
      return /^\d{11}$/.test(cleanValue)
        ? null
        : "El CUIL debe tener 11 dígitos";
    }

    if (tipo === "Nro_Afil") {
      return /^\d{1,10}$/.test(cleanValue)
        ? null
        : "El número de afiliado debe ser un número de hasta 10 dígitos";
    }

    if (tipo === "nro_cobertura") {
      return /^\d+$/.test(cleanValue)
        ? null
        : "El número de cobertura debe contener solo números";
    }

    if (tipo === "nombre" || tipo === "apellido") {
      return /^[a-zA-Z\s]+$/.test(valor)
        ? null
        : "Solo puede contener letras y espacios";
    }

    return null;
  }

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
    const error = validarInput(values.value, values.param, values.plan);

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
          borderRadius: 1,
          backgroundColor: "background.paper",
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
                  <FormControlLabel
                    value="nro_cobertura"
                    control={<Radio size="small" />}
                    label={
                      <Tooltip title="Busqueda por numero de cobertura">
                        <span>Grupo Familiar</span>
                      </Tooltip>
                    }
                  />
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
                />
                <FormHelperText>{errors.value}</FormHelperText>
              </FormControl>
            </Stack>
          </Box>
        </motion.div>

        <Stack direction={"row"} spacing={1}>
          <Button
            type="submit"
            sx={{
              borderColor: "rgba(0, 154, 218, 0.5)",
              bgcolor: "rgba(65, 165, 207, 0.2)",
              "&:hover": { bgcolor: "rgba(59, 172, 221, 0.5)" },
            }}
            size="large"
            variant="outlined"
            loading={loading}
          >
            Buscar
          </Button>
        </Stack>
      </Box>
    </AnimatePresence>
  );
}