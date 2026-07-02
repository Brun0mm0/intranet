import { createSlice } from "@reduxjs/toolkit";
import {fetchUsuarios, fetchActualizarRol, fetchNuevoUsuario } from "./thunk";
export const adminSlice = createSlice({
    name:'administrador',
    initialState:{
        loadingUsuarios: false,
        loadingNuevoUsuario: false,
        usuarios: [],
        error: null,
    },
    reducers:{
        resetState: (state) => {
            state.loadingUsuarios = false;
            state.loadingNuevoUsuario = false;
            state.usuarios = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // -- fetchUsuarios ------------------------------------
        .addCase(fetchUsuarios.pending, (state) => {
            state.loadingUsuarios = true;
            state.error = null;
        })
        .addCase(fetchUsuarios.fulfilled, (state, action) => {
            state.loadingUsuarios = false;
            state.usuarios = action.payload;
            state.error = null;
        })
        .addCase(fetchUsuarios.rejected, (state, action) => {
            state.loadingUsuarios = false;
            state.usuarios = [];
            state.error = action.payload;
        })
        // -- fetchNuevoUsuario ------------------------------------
        .addCase(fetchNuevoUsuario.pending, (state) => {
            state.loadingNuevoUsuario = true;
            state.error = null;
        })
        .addCase(fetchNuevoUsuario.fulfilled, (state, action) => {
            state.loadingNuevoUsuario = false;
            state.error = null;
        })
        .addCase(fetchNuevoUsuario.rejected, (state, action) => {
            state.loadingNuevoUsuario = false;
            state.error = action.payload;
        })
        // -- fetchActualizarRol ------------------------------------
        .addCase(fetchActualizarRol.rejected, (state, action) => {
            state.error = action.payload;
        })
    }
});

export const { resetState } = adminSlice.actions;