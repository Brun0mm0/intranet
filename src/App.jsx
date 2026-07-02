import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './auth'
import AppRouter from "./routes/AppRouter";
import NotificationProvider from "./components/NotificationProvider"
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function App() {
  return (
    
    <BrowserRouter>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppRouter />
        </LocalizationProvider>
        <NotificationProvider />
      </AuthProvider>
    </BrowserRouter>
  )
}
