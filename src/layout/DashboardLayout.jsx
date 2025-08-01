import {Box, CssBaseline, Stack} from '@mui/material';
import {alpha} from '@mui/material/styles';
import { Outlet } from 'react-router-dom';

import AppNavbar from '../components/AppNavbar';
import SideMenu from '../components/SideMenu';
import Header from '../components/Header';
import AppTheme from '../shared-theme/AppTheme';

export default function DashboardLayout({themeComponents}) {
    return (
        <AppTheme themeComponents={themeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex'}}>
                <SideMenu />
                <AppNavbar />
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                        : alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                    })}
                >
                    <Stack
                      spacing={1}
                      sx={{
                        alignItems: 'center',
                        mx: 3,
                        pb: 5,
                        mt: {xs: 8, md: 0}
                      }}
                    >
                        <Header />
                        <Outlet />
                    </Stack>                        
                </Box>
            </Box> 
        </AppTheme>
    );
}
