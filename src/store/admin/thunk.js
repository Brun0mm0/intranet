import { createAsyncThunk } from "@reduxjs/toolkit";
import intranetApi from "../../api/intranetApi";
import { showNotification } from "../notification/notificationSlice";

export const fetchUsuarios = createAsyncThunk(
    'administrador/fetchUsuarios',
    async (_, { rejectWithValue, dispatch }) => {
        //  👆 segundo argumento desestructurado correctamente
        try {
            const res = await intranetApi.get('/modificarusuario/')
            return res.data.data
        } catch (err) {
            const mensaje = err.response?.data?.message ?? 'Error al cargar usuarios'
            dispatch(showNotification({ message: mensaje, type: 'error' }))
            return rejectWithValue(mensaje)
        }
    }
)

export const fetchActualizarRol = createAsyncThunk(
    'administrador/fetchActualizarRol',
    async ({ usuario, rolId }, { rejectWithValue, dispatch }) => {
        try {
            const body = {
                UsuarioID: usuario.UsuarioID,
                usuario:   usuario.NombreUsuario,
                email:     usuario.Email,
                cuil:      usuario.cuil,
                rol_id:    rolId,
            }
            const res = await intranetApi.put('/modificarusuario/', body)
            dispatch(showNotification({ message: res.data.message, type: 'success' }))
            return res.data
        } catch (err) {
            const mensaje = err.response?.data?.message ?? 'Error al actualizar el rol'
            dispatch(showNotification({ message: mensaje, type: 'error' }))
            return rejectWithValue(mensaje)
        }
    }
)

export const fetchNuevoUsuario = createAsyncThunk(
    'administrador/fetchNuevoUsuario',
    async (datos, { rejectWithValue, dispatch }) => {
        try {
            const formData = new FormData();
            formData.append('Cuil', datos.Cuil);
            formData.append('Usuario', datos.Email);
            formData.append('Email', `${datos.Email}@osssb.com.ar`);
            formData.append('Rol', datos.Rol);

            const res = await intranetApi.post('/page/procesoarchivo/formulario', formData)
            dispatch(showNotification({ message: res.data.message, type: 'success' }))
            dispatch(fetchUsuarios())
            return null
        } catch (err) {
            const mensaje = err.response?.data?.message ?? 'Error al crear usuario'
            dispatch(showNotification({ message: mensaje, type: 'error' }))
            return rejectWithValue(mensaje)
        }
    }
)