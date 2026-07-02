import { createSlice } from "@reduxjs/toolkit";

export const padronSlice = createSlice({
    name: 'padrones',
    initialState: {
        afiliadoArr: [],
        aportes: [],
        loading: false,
        error: null,
    },
    reducers: {
        startLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        endLoading: (state) => {
            state.loading = false;
        },
        setAfiliadoArr: (state, action) => {
            state.afiliadoArr = action.payload;
            state.loading = false;
        },
        setAportes: (state, action) => {
            state.aportes = action.payload;
            state.loading = false;
        },
        setError: (state, action) => {
            state.afiliadoArr = [];
            state.error = action.payload;
            state.loading = false;
        },
        reset: (state) => {
            state.afiliadoArr = [];
            state.aportes = [];
            state.loading = false;
            state.error = null;
        }
    }
})

export const { endLoading,
               startLoading, 
               setAfiliadoArr, 
               setAportes, 
               setError,
               reset } = padronSlice.actions;