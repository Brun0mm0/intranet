import { createSlice } from "@reduxjs/toolkit";

export const fiscalizacionSlice = createSlice({
    name: 'fiscalizacion',
    initialState: {
        envioRelacionesLaborales: { loading:false, error:null },
        envioDomiciliosExplotacion: { loading:false, error:null },
        listadoArchivosRecientes: { data: [], loading:false, error:null },
        listadoRelacionesLaborales: { cuit: null, data: [], loading:false, error:null },
    },
    reducers: {
        // 🔹 Relaciones Laborales
        startEnvioRelacionesLaborales: (state) => {
            state.envioRelacionesLaborales.loading = true
            state.envioRelacionesLaborales.error = null
        },
        successEnvioRelacionesLaborales: (state) => {
            state.envioRelacionesLaborales.loading = false
            state.envioRelacionesLaborales.error = null
        },
        errorEnvioRelacionesLaborales: (state, action) => {
            state.envioRelacionesLaborales.loading = false
            state.envioRelacionesLaborales.error = action.payload
        },
        // 🔹 Listado de archivos
        startListadoArchivos: (state) => {
            state.listadoArchivosRecientes.loading = true
            state.listadoArchivosRecientes.error = null
        },
        successListadoArchivos: (state, action) => {
            state.listadoArchivosRecientes.data = action.payload
            state.listadoArchivosRecientes.loading = false
            state.listadoArchivosRecientes.error = null
        },
        errorListadoArchivos: (state, action) => {
            state.listadoArchivosRecientes.error = action.payload
            state.listadoArchivosRecientes.loading = false
        },
        // 🔹 Domicilio de explotacion
        startEnvioDomiciliosExplotacion: (state) => {
            state.envioDomiciliosExplotacion.loading = true
            state.envioDomiciliosExplotacion.error = null
        },
        successEnvioDomiciliosExplotacion: (state) => {
            state.envioDomiciliosExplotacion.loading = false
            state.envioDomiciliosExplotacion.error = null
        },
        errorEnvioDomiciliosExplotacion: (state, action) => {
            state.envioDomiciliosExplotacion.loading = false
            state.envioDomiciliosExplotacion.error = action.payload
        },
        // 🔹 Listado Domicilio de Explotacion
        startListadoDomicilios: (state, action) => {
            state.listadoRelacionesLaborales.loading = true
            state.listadoRelacionesLaborales.cuit = action.payload
            state.listadoRelacionesLaborales.error = null
        },
        successListadoDomicilios: (state, action) => {
            state.listadoRelacionesLaborales.loading = false
            state.listadoRelacionesLaborales.data = action.payload
            state.listadoRelacionesLaborales.error = null
        },
        errorListadoDomicilios: (state, action) => {
            state.listadoRelacionesLaborales.loading = false
            state.listadoRelacionesLaborales.error = action.payload
        },
        resetFiscalizacionState: () => ({
            envioRelacionesLaborales: { loading:false, error:null },
            envioDomiciliosExplotacion: { loading:false, error:null },
            listadoArchivos: { data: [], loading:false, error:null },
            listadoDomicilios: { data: [], loading:false, error:null },
        })
        
    }})

export const {
    startEnvioRelacionesLaborales, 
    successEnvioRelacionesLaborales,
    errorEnvioRelacionesLaborales,
    startListadoArchivos,
    successListadoArchivos,
    errorListadoArchivos,
    startEnvioDomiciliosExplotacion,
    successEnvioDomiciliosExplotacion,
    errorEnvioDomiciliosExplotacion,
    startListadoDomicilios,
    successListadoDomicilios,
    errorListadoDomicilios
} = fiscalizacionSlice.actions;