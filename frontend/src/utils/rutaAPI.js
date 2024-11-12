// src/utils/rutaAPI.js
import axios from 'axios';

// Crear una instancia de axios con configuración base
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getRutasConductor = async (userId) => {
    try {
        const response = await api.get(`/rutas/conductor/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const eliminarRuta = async (rutaId) => {
    try {
        const response = await api.delete(`/rutas/${rutaId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const actualizarVehiculo = async (userId, vehiculoData) => {
    try {
        const response = await api.put(`/conductores/${userId}/vehiculo`, vehiculoData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
