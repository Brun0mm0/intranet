import { createSlice } from "@reduxjs/toolkit";

export const prestacionesSlice = createSlice({
    name: 'prestaciones',
    initialState: {
        loading: false,
        proveedor: {
                cuit: '',
                razon_social: '',
        },
        facturas: [],
        error: null,
    },
    reducers: {
        startLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setProveedor: (state, action) => {
            state.proveedor = action.payload;
        },
        setFacturas: (state, action) => {
            state.facturas = action.payload;
            state.loading = false;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        resetState: (state) => {
            state.loading = false;
            state.proveedor = {
                cuit: '',
                razon_social: '',
            };
            state.facturas = [];
            state.error = null;
        }
    }
})

export const { startLoading, setProveedor, setFacturas, setError, resetState } = prestacionesSlice.actions;