// FiscalizacionPage.jsx - Agrega manejo de redirección
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";
import { useSessionState } from "../../hooks/useSessionState.js";
import ErrorBoundary from "../../components/common/ErrorBoundary.jsx";

export default function FiscalizacionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Si estamos en /fiscalizaciones sin subruta, redirigir a relación laboral
  if (location.pathname === "/fiscalizaciones") {
    return <Navigate to="/fiscalizaciones/relacion-laboral" replace />;
  }
  
  // Control del cambio de pestaña
  const handleChange = (event, newValue) => {
    navigate(newValue);
  };
  
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#fff",
        borderRadius: 1,
        boxShadow: 2,
        // p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        value={location.pathname}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant="standard"
        scrollButtons="auto"
        sx={{ mb: 1 }}
      >
        <Tab
          label="Relación Laboral"
          value="/fiscalizaciones/relacion-laboral"
          sx={{margin:0}}
          />
        <Tab
          label="Domicilio de Explotación"
          value="/fiscalizaciones/domicilio-explotacion"
          sx={{margin:0}}
        />
      </Tabs>

      <Box sx={{ flexGrow: 1, overflow: "auto", px: 2 }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
    </Box>
  );
}