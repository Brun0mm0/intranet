import { createSlice } from "@reduxjs/toolkit";

export const afiliacionesSlice = createSlice({
    name:'afiliaciones',
    initialState: {
        loading:false,
        afiliado:null,
        error:null
    },
    reducers: {
        setLoading: ( state, action ) => {
            state.loading = action.payload
        },
        setAfiliado: ( state, action ) => {
            state.afiliado = action.payload
        },
        setError: ( state, action ) => {
            state.error = action.payload
        },
        reset: ( state ) => { 
            state.loading = false;
            state.afiliado = null;
            state.error = null;
         }
    }
});

export const { setLoading, setAfiliado, setError, reset } = afiliacionesSlice.actions;