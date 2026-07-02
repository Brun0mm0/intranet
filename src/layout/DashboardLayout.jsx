import {Box, CssBaseline, Stack} from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import SideMenu from '../components/SideMenu/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import { useAuth } from '../auth';
import Header from '../components/header/Header';
import { ChatBotContainer } from '../components/chatBot/ChatBotContainer';

export default function DashboardLayout({themeComponents}) {
    const {user, loading} = useAuth();
    const location = useLocation();

    if (loading) { return <div>Loading...</div>; } 

    return (
        <AppTheme themeComponents={themeComponents} >
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex'}}>
                <SideMenu usuario={user?.usuario}/>
                <AppNavbar />
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        height: '100dvh',
                        backgroundImage:"linear-gradient(345deg, rgba(0,169,218,.5) 0%, rgba(175,218,237,0.3) 25%, rgba(175,218,237,0.3) 75%, rgba(2,181,126,.5) 100%)",   
                        overflow: 'auto',
                    })}
                >
                    <Stack
                      spacing={1}
                      sx={{
                        alignItems: 'center',
                        height: '100%',
                        mx: 2,
                        pb: 1,
                        mt: {xs: 8, md: 0}
                      }}
                    >
                        <Header />
                            <Outlet />
                    </Stack>                        
                </Box>
            </Box>
            {/* <ChatBotContainer />  */}
        </AppTheme>
    );
}
