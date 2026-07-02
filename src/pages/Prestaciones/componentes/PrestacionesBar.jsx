import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Box,
  FormHelperText,
  Button,
} from "@mui/material";
import { SearchInput } from "../../../components/inputs/SearchInput";
import useForm from "../../../hooks/useForm";
import { useDispatch } from "react-redux";
import { fetchConsultaFacturas } from "../../../store/prestaciones/thunks";

export const PrestacionesBar = ({ loading, errorText = null, onSearchParamChange }) => {

  const dispatch = useDispatch();
  const { values, handleChange } = useForm({ param: "cuit", value: "" });

  const formatCuit = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 10) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`;
  };

  const handleRadioChange = (e) => {
    handleChange(e);
  };

  const handleInputChange = (e) => {
    let value = e.target.value;

    if (values.param === "cuit") {
      value = formatCuit(value);
    }

    handleChange({
      target: {
        name: e.target.name,
        value,
      },
    });
  };

  const handleBuscar = () => {
    onSearchParamChange(values.param);
    dispatch(fetchConsultaFacturas(values));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBuscar();
  };

  return (
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
      <Box width={"100%"} display={"flex"}>
        <Stack direction="column" spacing={1} flexGrow={1}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="padrones-bar-label-params"
              name="param"
              onChange={handleRadioChange}
              value={values.param}
              sx={{ px: 0 }}
            >
              <FormControlLabel
                control={<Radio size="small" />}
                value="cuit"
                label="CUIT"
              />
              <FormControlLabel
                control={<Radio size="small" />}
                value="razon_social"
                label="Razón Social"
              />
              <FormControlLabel
                control={<Radio size="small" />}
                value="numero_factura"
                label="Nro de Factura"
              />
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
          <FormControl variant="outlined" error={Boolean(errorText)}>
            <SearchInput
              name="value"
              value={values.value}
              onChange={handleInputChange}
            />
            <FormHelperText>{errorText}</FormHelperText>
          </FormControl>
        </Stack>
      </Box>

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
  );
};