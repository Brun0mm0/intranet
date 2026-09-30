// Roles de usuario de la intranet: nombre, descripción y color para la tabla y el formulario.
export const ROLES = {
    1: { label: "Administrador", desc: "Acceso completo al sistema.", color: "#0b3b4f" },
    2: { label: "Usuario", desc: "Acceso básico para usuarios registrados.", color: "#0079a0" },
    3: { label: "Recursos Humanos", desc: "Acceso para recursos humanos.", color: "#7a5af8" },
    4: { label: "Empleado", desc: "Acceso al padrón.", color: "#00a9da" },
    5: { label: "Afiliaciones", desc: "Módulo de afiliaciones y credenciales.", color: "#e8a317" },
    6: { label: "Sucursales", desc: "Módulo de sucursales.", color: "#8a979d" },
    7: { label: "Prestaciones", desc: "Control de facturas de prestadores.", color: "#02b57e" },
};

export const ROLES_IDS = Object.keys(ROLES).map(Number);
