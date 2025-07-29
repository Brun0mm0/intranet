import DashboardLayout from '../layout/DashboardLayout';
import DashboardPage from '../pages/DashboardPages';
import PadronPage from '../pages/PadronPage';

export const routes = [
    {
        path:'/dashboard',
        component: DashboardLayout,
        // roles: ['admin'],
        children: [
            {
                path:'',
                component:DashboardPage,
            },
            {
                path:'padrones',
                component:PadronPage,
            }
        ],
    },
    {},
    {},
];