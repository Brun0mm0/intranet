import { Box } from "@mui/material"
import { AfiliacionesCredencial } from "./components/AfiliacionesCredencial"


export default function AfiliacionesPage() {
    return (

        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'start',
                textAlign: 'center',
                width: '100%',
                px: 1,
                // pt: 5
            }}
        >
            <AfiliacionesCredencial />
                </Box>
    )
}