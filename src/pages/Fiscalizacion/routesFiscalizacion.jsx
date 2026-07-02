import { DomicilioExplotacionComponent } from "./components/domicilioExplotacion/DomicilioExplotacionComponent";
import { RelacionLaboralComponent } from "./components/relacionLaboral/RelacionLaboralComponet";

export const routesFiscalizacion = [
  {
    path: "relacion-laboral",
    component: RelacionLaboralComponent
  },
  {
    path: "domicilio-explotacion", 
    component: DomicilioExplotacionComponent
  }
];