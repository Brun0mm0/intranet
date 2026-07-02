import { combineReducers } from "@reduxjs/toolkit";

import { padronSlice } from "./padrones/padronSlice";
import { afiliacionesSlice } from "./afiliaciones/afiliacionesSlice";
import { fiscalizacionSlice } from "./fiscalizacion/fiscalizacionSlice";
import { notificationSlice } from "./notification/notificationSlice";
import { adminSlice } from "./admin/adminSlice";
import  {prestacionesSlice } from "./prestaciones/prestacionesSlice";

const appReducer = combineReducers({
    padrones: padronSlice.reducer,
    afiliaciones: afiliacionesSlice.reducer,
    fiscalizacion: fiscalizacionSlice.reducer,
    notification: notificationSlice.reducer,
    administrador: adminSlice.reducer,
    prestaciones: prestacionesSlice.reducer
})

export const rootReducer = (state, action) => {
    if (action.type === 'RESET_APP_STATE') {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
}