import DashboardLayout from '../layout/DashboardLayout';

import LoginPage from '../auth/LoginPage';
import AfiliacionesPage from '../pages/Afiliaciones/AfiliacionesPage';
import {AdminPage} from '../pages/Admin/AdminPage';
import PadronPage from '../pages/Padron/PadronPage';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import GroupsIcon from '@mui/icons-material/Groups';
import { PrestacionesPage } from '../pages/Prestaciones/PrestacionesPage';
import PlagiarismRoundedIcon from '@mui/icons-material/PlagiarismRounded';
import ForwardToInboxRoundedIcon from '@mui/icons-material/ForwardToInboxRounded';
import { AvisoPagoPage } from '../pages/AvisoPago/AvisoPagoPage';
// import PaginaCrearUsuario from '../auth/PaginaCrearUsuario';


export const routes = [
  { path: '', redirectTo: '/login' },
  { path: '/login', component: LoginPage, protected: false },
  // { path: '/signin', component: PaginaCrearUsuario, protected: false },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        index: true,
        redirectTo: '/login'
      },
      {
        path: 'padrones',
        component: PadronPage,
        protected: true,
        roles: [1, 2, 3, 4, 5, 6, 7],
        label: 'Padrón',
        icon: GroupsIcon,
        showInMenu: true
      },
      {
        path: 'afiliaciones',
        component: AfiliacionesPage,
        protected: true,
        roles: [1, 5, 6],
        label: 'Credenciales',
        icon: MedicalInformationIcon,
        showInMenu: true
      },
      {
        path: 'prestaciones',
        component: PrestacionesPage,
        protected: true,
        roles: [1, 7],
        label: 'Control de Facturas',
        icon: PlagiarismRoundedIcon,
        showInMenu: true
      },
      {
        path: 'admin',
        component: AdminPage,
        protected: true,
        roles: [1],
        label: 'Admin',
        icon: AdminPanelSettingsIcon,
        showInMenu: true
      },
      {
        path: 'aviso-pago',
        component: AvisoPagoPage,
        protected: true,
        roles: [1,8],
        label: 'Aviso de Pago',
        icon: ForwardToInboxRoundedIcon,
        showInMenu: true,
      }
    ],
  },
];