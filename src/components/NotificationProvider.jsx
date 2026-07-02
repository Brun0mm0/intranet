import { Alert, AlertTitle ,Snackbar } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { hideNotification } from "../store/notification/notificationSlice"

const NotificationProvider = () => {
    const dispatch = useDispatch();
    const { open, message, type } = useSelector(state => state.notification);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        dispatch(hideNotification());
    }
  return (
    <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
        <Alert onClose={handleClose} severity={type || 'info'} sx={{ width: '100%' }}>
            <AlertTitle>{type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info'}</AlertTitle>
            {message}
        </Alert>
    </Snackbar>
  );
}

export default NotificationProvider;