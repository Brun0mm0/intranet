import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    open: false,
    message: null,
    type: 'info', // 'success' | 'error' | 'info'
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action) => {
            state.open = true;
            state.message = action.payload.message;
            state.type = action.payload.type || 'info';
        },
        hideNotification: (state) => {
            state.open = false;
            state.message = null;
            state.type = null;
        },
    }, 
});

export const { showNotification, hideNotification } = notificationSlice.actions;