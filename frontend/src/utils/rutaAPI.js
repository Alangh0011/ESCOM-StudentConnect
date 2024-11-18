import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para manejar el token y errores
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en petición API:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });
        return Promise.reject({
            message: error.response?.data?.mensaje || 'Error en el servidor',
            status: error.response?.status,
            data: error.response?.data,
            originalError: error
        });
    }
);


export const getRutasConductor = async (userId) => {
    try {
        const response = await api.get(`/rutas/conductor/${userId}/proximos-7-dias`);
        
        // Procesar las fechas correctamente
        const rutasProcesadas = response.data.map(ruta => ({
            ...ruta,
            fechaProgramada: ruta.fechaProgramada, // No formatees aquí, usa directamente el dato
            paradas: Array.isArray(ruta.paradas) ? ruta.paradas.map(parada => ({
                ...parada,
                distanciaParada: Number(parada.distanciaParada) || 0,
                costoParada: Number(parada.costoParada) || 0
            })) : []
        }));

        return rutasProcesadas;
    } catch (error) {
        console.error('Error en getRutasConductor:', error);
        throw error;
    }
};


export const eliminarRuta = async (rutaId) => {
    try {
        const response = await api.delete(`/rutas/${rutaId}`);
        return response.data;
    } catch (error) {
        console.error('Error en eliminarRuta:', error);
        throw error;
    }
};

export const actualizarDistanciaTotal = async (rutaId, distancia) => {
    try {
        const response = await api.post(`/rutas/${rutaId}/actualizarDistancia`, { 
            distancia: Number(distancia) 
        });
        return response.data;
    } catch (error) {
        console.error('Error en actualizarDistanciaTotal:', error);
        throw error;
    }
};

/*********************************************************************************** */

export const getViajesHoy = async (userId, tipoRuta) => {
    try {
        const response = await api.get(`/viajes/conductor/${userId}/rutas-hoy/${tipoRuta}`);
        console.log('Respuesta raw de viajes:', response.data);
        
        return response.data.map(viaje => ({
            ...viaje,
            id: viaje.viajeId || viaje.rutaId,
            rutaId: viaje.rutaId,
            nombreRuta: viaje.nombreRuta,
            fechaProgramada: viaje.fechaProgramada,
            estado: viaje.estado || 'PENDIENTE',
            numeroPasajeros: viaje.numeroPasajeros || 0,
            numeroParadas: viaje.numeroParadas || 0,
            paradas: Array.isArray(viaje.paradas) ? viaje.paradas : [],
            pasajeros: Array.isArray(viaje.pasajeros) ? viaje.pasajeros : []
        }));
    } catch (error) {
        console.error('Error al obtener viajes:', error);
        throw error;
    }
};

export const iniciarViaje = async (request) => {
    try {
        console.log('Enviando petición iniciar viaje:', request);
        const response = await api.post('/viajes/iniciar', request);
        
        if (!response.data?.viajeId || !response.data?.ubicacionConductorId) {
            throw new Error('Respuesta del servidor incompleta');
        }
        
        console.log('Respuesta iniciar viaje:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al iniciar viaje:', error);
        throw error;
    }
};



export const finalizarViaje = async (viajeId) => {
    try {
        const response = await api.post('/viajes/finalizar', { viajeId });
        return response.data;
    } catch (error) {
        console.error('Error al finalizar viaje:', error);
        throw error;
    }
};

// Nuevos servicios de Ubicación
export const actualizarUbicacion = async (ubicacionConductorId, ubicacion) => {
    try {
        if (!ubicacionConductorId) {
            throw new Error('ID de ubicación del conductor no proporcionado');
        }

        const response = await api.post(`/ubicacion/actualizar/${ubicacionConductorId}`, {
            lat: ubicacion.lat,
            lng: ubicacion.lng,
            timestamp: new Date().toISOString(),
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar ubicación:', error);
        throw error;
    }
};


export const obtenerUltimaUbicacion = async (viajeId) => {
    try {
        const response = await api.get(`/ubicacion/ultima/${viajeId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener última ubicación:', error);
        throw error;
    }
};

// Función para manejar errores WebSocket
export const handleWebSocketError = (error) => {
    console.error('Error WebSocket:', error);
    return {
        message: typeof error === 'string' ? error : error.message || 'Error de conexión',
        isWebSocketError: true
    };
};

export const calificarPasajero = async (calificacionData) => {
    try {
        console.log('Enviando calificación al servidor:', calificacionData);
        // Transformar los datos al formato que espera el backend
        const requestData = {
            viajeId: calificacionData.viajeId,
            pasajeroId: calificacionData.pasajeroId,
            calificacion: calificacionData.calificacion,
            comentario: calificacionData.comentario,
            pasajero: {
                id: calificacionData.pasajeroId
            }
        };
        
        const response = await api.post('/calificaciones/conductor/calificar-pasajero', requestData);
        return response.data;
    } catch (error) {
        console.error('Error al calificar pasajero:', error);
        throw new Error(error.response?.data?.mensaje || 'Error al calificar al pasajero');
    }
};

export const obtenerCalificacionesViaje = async (viajeId) => {
    try {
        const response = await api.get(`/calificaciones/viaje/${viajeId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener calificaciones:', error);
        throw {
            message: error.response?.data?.mensaje || 'Error al obtener calificaciones',
            status: error.response?.status,
            originalError: error
        };
    }
};


/********************************************************************************** */

export const obtenerDetallesViaje = async (viajeId) => {
    try {
        const response = await api.get(`/api/viajes/${viajeId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalles del viaje:', error);
        throw error;
    }
};

export const calificarConductor = async (calificacionData) => {
    try {
        const response = await api.post('/api/calificaciones/pasajero/calificar-conductor', calificacionData);
        return response.data;
    } catch (error) {
        console.error('Error al calificar conductor:', error);
        throw error;
    }
};