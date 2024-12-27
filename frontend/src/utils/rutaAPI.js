import axios from 'axios';

const api = axios.create({
    baseURL: 'https://studentconnect-backend.azurewebsites.net/api',
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
        const response = await api.post('/viajes/finalizar', { 
            viajeId,
            fechaFinalizacion: new Date().toISOString(),
            estado: 'FINALIZADO',
            requiereCalificacionConductor: true,
            requiereCalificacionPasajero: true
        });
        
        await notificarFinViaje(viajeId);
        
        return response.data;
    } catch (error) {
        console.error('Error al finalizar viaje:', error);
        throw error;
    }
};

export const verificarCalificacionesPendientes = async (viajeId, userId, tipo) => {
    try {
        const response = await api.get(`/calificaciones/pendientes/${viajeId}`, {
            params: {
                userId,
                tipo // 'CONDUCTOR' o 'PASAJERO'
            }
        });
        
        return {
            requiereCalificacion: response.data.requiereCalificacion,
            calificaciones: response.data.calificaciones || []
        };
    } catch (error) {
        console.error('Error al verificar calificaciones pendientes:', error);
        return {
            requiereCalificacion: false,
            calificaciones: []
        };
    }
};

const notificarFinViaje = async (viajeId) => {
    try {
        await api.post(`/viajes/${viajeId}/notificar-fin`);
    } catch (error) {
        console.error('Error al notificar fin de viaje:', error);
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

// En rutaAPI.js, modificar la función obtenerDetallesViaje
export const obtenerDetallesViaje = async (viajeId) => {
    try {
        console.log('Obteniendo detalles del viaje:', viajeId);
        const response = await api.get(`/reservaciones/viaje-activo/${viajeId}`);
        console.log('Respuesta detalles viaje:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalles del viaje:', error);
        throw error;
    }
};




// Actualizar la función calificarConductor
export const calificarConductor = async (calificacionData) => {
    try {
        const response = await api.post('/calificaciones/pasajero/calificar-conductor', {
            viajeId: calificacionData.viajeId,
            pasajeroId: calificacionData.pasajeroId,
            calificacion: calificacionData.calificacion,
            comentario: calificacionData.comentario || ''
        });
        
        console.log('Respuesta calificación conductor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al calificar conductor:', error);
        throw new Error(error.response?.data?.mensaje || 'Error al calificar al conductor');
    }
};

export const obtenerViajeActivo = async (pasajeroId) => {
    try {
        const response = await api.get(`/reservaciones/viaje-activo/${pasajeroId}`);
        if (!response.data) {
            return null; // No hay viaje activo
        }
        return {
            ...response.data,
            estado: response.data.estado || 'PENDIENTE',
            calificado: response.data.calificado || false
        };
    } catch (error) {
        if (error.status === 404) {
            console.warn('No se encontró viaje activo para el pasajero:', pasajeroId);
            return null; // Manejo explícito del 404
        }
        console.error('Error al obtener viaje activo:', error);
        throw error;
    }
};


export const obtenerEstadoCompletoViaje = async (viajeId) => {
    try {
        const response = await api.get(`/viajes/${viajeId}/estado-completo`);
        return {
            estado: response.data.estado,
            calificaciones: {
                conductor: {
                    completada: response.data.calificacionConductorCompletada,
                    pendiente: response.data.calificacionConductorPendiente
                },
                pasajeros: {
                    completadas: response.data.calificacionesPasajerosCompletadas,
                    pendientes: response.data.calificacionesPasajerosPendientes
                }
            }
        };
    } catch (error) {
        console.error('Error al obtener estado completo del viaje:', error);
        throw error;
    }
};

export const actualizarUbicacion = async (viajeId, ubicacion) => {
    try {
        const response = await api.post(`/ubicacion/actualizar/${viajeId}`, ubicacion);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar ubicación:', error);
        throw new Error(
            error.response?.data?.mensaje || 
            'Error al actualizar la ubicación'
        );
    }
};

export const obtenerUltimaUbicacion = async (viajeId) => {
    try {
        const response = await api.get(`/ubicacion/ultima/${viajeId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener última ubicación:', error);
        // Si es 404, no hay ubicación registrada aún
        if (error.response?.status === 404) {
            return null;
        }
        throw new Error(
            error.response?.data?.mensaje || 
            'Error al obtener la última ubicación'
        );
    }
};

export const crearReservacion = async (reservacionData) => {
    try {
        const response = await api.post('/reservaciones/crear', {
            pasajeroId: reservacionData.pasajeroId,
            rutaId: reservacionData.rutaId,
            paradaId: reservacionData.paradaId,
            tipoRuta: reservacionData.tipoRuta
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear reservación:', error);
        throw new Error(error.response?.data?.mensaje || 'Error al crear la reservación');
    }
};

// Asegurarse de que esta función esté actualizada
export const obtenerRutasDisponibles = async () => {
    try {
        const response = await api.get('/rutas/proximos-7-dias');
        return response.data;
    } catch (error) {
        console.error('Error al obtener rutas disponibles:', error);
        throw error;
    }
};

export const verificarEstadoViaje = async (viaje, userId, onViajeUpdate, setMostrarCalificacion) => {
    if (!viaje?.viajeId) return false;

    try {
        // Obtener el estado del viaje desde el endpoint de viaje activo
        const viajeActualizado = await obtenerViajeActivo(userId);
        console.log('Estado actual del viaje:', viajeActualizado?.estado);

        if (viajeActualizado?.estado === 'FINALIZADO' && !viaje.calificado) {
            console.log('El viaje ha finalizado y requiere calificación');
            if (onViajeUpdate) {
                onViajeUpdate({
                    ...viaje,
                    estado: 'FINALIZADO',
                });
            }
            setMostrarCalificacion(true);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al verificar estado del viaje:', error);
        return false;
    }
};

// En rutaAPI.js, añadir el nuevo método
export const verificarEstadoCalificaciones = async (viajeId) => {
    try {
        const response = await api.get(`/calificaciones/viaje/${viajeId}/estado`);
        return response.data;
    } catch (error) {
        console.error('Error al verificar estado de calificaciones:', error);
        throw error;
    }
};

// Añadir esta función a rutaAPI.js
export const obtenerHistorialPasajero = async (pasajeroId) => {
    try {
        const response = await api.get(`/reservaciones/historial/${pasajeroId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener historial:', error);
        throw new Error(error.response?.data?.mensaje || 'Error al obtener el historial');
    }
};
