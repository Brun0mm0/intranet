import { createSlice } from "@reduxjs/toolkit";

export const padronSlice = createSlice({
    name: 'padrones',
    initialState: {
        afiliadoArr: [],
        loading: false,
        error: null,

        // ✅ Guarda qué parámetro se usó en la última búsqueda a
        // fetchAfiliadoArr ('dni' | 'cuil' | 'nro_cobertura' | etc.).
        // Necesario porque solo la búsqueda por nro_cobertura (grupo
        // familiar) tiene el problema de Cuil_titular null — el resto
        // de las búsquedas (apellido, dni, etc.) lo devuelven bien.
        ultimoParametroBusqueda: null,

        // ✅ Estado separado para el detalle de un afiliado (fetch uno a uno
        // por CUIL al hacer click en una fila). No comparte loading/error
        // con afiliadoArr para que un fallo acá no pise la lista principal.
        afiliadoDetalle: null,
        detalleLoading: false,
        detalleError: null,

        // ✅ Estado separado para aportes. Antes usaba el mismo startLoading/
        // setError que afiliadoArr: un fallo al buscar aportes de un
        // afiliado puntual vaciaba toda la tabla de resultados. Ahora es
        // independiente.
        aportes: [],
        aportesLoading: false,
        aportesError: null,
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
        setUltimoParametroBusqueda: (state, action) => {
            state.ultimoParametroBusqueda = action.payload;
        },
        setError: (state, action) => {
            state.afiliadoArr = [];
            state.error = action.payload;
            state.loading = false;
        },
        reset: (state) => {
            state.afiliadoArr = [];
            state.loading = false;
            state.error = null;
        },

        // 🔹 Reducers del detalle (independientes de los de arriba)
        startDetalleLoading: (state) => {
            state.detalleLoading = true;
            state.detalleError = null;
        },
        setAfiliadoDetalle: (state, action) => {
            state.afiliadoDetalle = action.payload;
            state.detalleLoading = false;
        },
        setDetalleError: (state, action) => {
            state.detalleError = action.payload;
            state.detalleLoading = false;
            // ✅ a propósito NO toca afiliadoArr ni afiliadoDetalle previo
        },
        resetAfiliadoDetalle: (state) => {
            state.afiliadoDetalle = null;
            state.detalleLoading = false;
            state.detalleError = null;
        },

        // 🔹 Reducers de aportes (independientes de afiliadoArr/loading/error)
        startAportesLoading: (state) => {
            state.aportesLoading = true;
            state.aportesError = null;
        },
        setAportes: (state, action) => {
            state.aportes = action.payload;
            state.aportesLoading = false;
        },
        setAportesError: (state, action) => {
            state.aportesError = action.payload;
            state.aportesLoading = false;
            // ✅ a propósito NO toca afiliadoArr ni afiliadoDetalle
        },
        resetAportes: (state) => {
            state.aportes = [];
            state.aportesLoading = false;
            state.aportesError = null;
        },
    }
})

export const { endLoading,
               startLoading,
               setAfiliadoArr,
               setUltimoParametroBusqueda,
               setError,
               reset,
               startDetalleLoading,
               setAfiliadoDetalle,
               setDetalleError,
               resetAfiliadoDetalle,
               startAportesLoading,
               setAportes,
               setAportesError,
               resetAportes } = padronSlice.actions;