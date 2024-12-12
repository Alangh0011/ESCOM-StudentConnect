import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
    getViajesHoy,
    iniciarViaje,
    finalizarViaje,
    actualizarUbicacion,
    calificarPasajero // Nuevo import
} from '../../utils/rutaAPI';
import MapaViaje from './MapaViaje';
import EstadoConexion from './EstadoConexion';
import LocationPermissionHandler from './LocationPermissionHandler';
import SelectorTipoRuta from './SelectorTipoRuta';
import ListaViajes from './ListaViajes';
import CalificacionModal from './CalificacionModal';

const TRACKING_INTERVAL = 10000;

const ViajeActivo = ({ userId }) => {
    const [tipoRuta, setTipoRuta] = useState('E');
    const [viajesHoy, setViajesHoy] = useState([]);
    const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
    const [viajeActivo, setViajeActivo] = useState(null);
    const [ubicacionActual, setUbicacionActual] = useState(null);
    const [mostrarCalificacion, setMostrarCalificacion] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [trackingInterval, setTrackingInterval] = useState(null);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    // Cargar viajes
    const cargarViajesHoy = useCallback(async () => {
        if (!userId) return;
        
        try {
            console.log(`Cargando viajes tipo ${tipoRuta} para conductor ${userId}`);
            const response = await getViajesHoy(userId, tipoRuta);
            console.log('Viajes recibidos raw:', response);
            
            const viajesProcesados = Array.isArray(response) ? response.map(viaje => {
                console.log('Procesando viaje:', viaje); // Para debug
                return {
                    ...viaje,
                    id: viaje.viajeId || viaje.id || viaje.rutaId, // Aseguramos tener un ID
                    rutaId: viaje.rutaId || viaje.ruta?.id,
                    nombreRuta: viaje.nombreRuta || viaje.ruta?.nombreRuta,
                    estado: viaje.estado || 'PENDIENTE',
                    fechaProgramada: viaje.fechaProgramada || viaje.fecha
                };
            }) : [];
            
            console.log('Viajes procesados:', viajesProcesados);
            setViajesHoy(viajesProcesados);
        } catch (err) {
            console.error('Error al cargar viajes:', err);
            toast.error('Error al cargar los viajes');
            setViajesHoy([]);
        }
    }, [userId, tipoRuta]);

    useEffect(() => {
        cargarViajesHoy();
    }, [cargarViajesHoy]);

    // Detener tracking
    const detenerTracking = useCallback(() => {
        if (trackingInterval) {
            clearInterval(trackingInterval);
            setTrackingInterval(null);
        }
        setIsConnected(false);
    }, [trackingInterval]);

    const actualizarUbicacionActual = useCallback(async (ubicacionConductorId) => {
        if (!navigator.geolocation) return;
    
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const nuevaUbicacion = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
    
                try {
                    console.log('Actualizando ubicación para ubicacionConductorId:', ubicacionConductorId, nuevaUbicacion);
                    await actualizarUbicacion(ubicacionConductorId, nuevaUbicacion); // Cambiar a ubicacionConductorId
                    setUbicacionActual(nuevaUbicacion);
                    setIsConnected(true);
                    setLastUpdate(new Date());
                    console.log('Ubicación actualizada:', nuevaUbicacion, 'Hora:', new Date().toLocaleTimeString());
                } catch (error) {
                    console.error('Error al actualizar ubicación:', error);
                    setIsConnected(false);
                }
            },
            (error) => {
                console.error('Error al obtener ubicación:', error);
                setIsConnected(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 3000,
                maximumAge: 0,
            }
        );
    }, []);
    
    

    const iniciarTracking = useCallback((ubicacionConductorId) => {
        if (!ubicacionConductorId) {
            console.error('No hay ID de ubicación del conductor para iniciar tracking');
            return;
        }
    
        // Detener tracking existente si hay
        detenerTracking();
    
        // Primera actualización inmediata
        actualizarUbicacionActual(ubicacionConductorId);
    
        // Iniciar intervalo de tracking
        const intervalId = setInterval(() => actualizarUbicacionActual(ubicacionConductorId), TRACKING_INTERVAL);
        setTrackingInterval(intervalId);
    
        return () => {
            clearInterval(intervalId);
            setIsConnected(false);
        };
    }, [detenerTracking, actualizarUbicacionActual]);
    

    
    const iniciarViajeHandler = async () => {
        if (!viajeSeleccionado) {
            toast.error('Selecciona un viaje primero');
            return;
        }
    
        if (!viajeSeleccionado.rutaId) {
            console.error('El viaje seleccionado no tiene un rutaId:', viajeSeleccionado);
            toast.error('Error: El viaje no tiene el identificador de la ruta');
            return;
        }
    
        if (!locationPermissionGranted) {
            toast.error('Permite el acceso a tu ubicación para continuar');
            return;
        }
    
        try {
            console.log('Iniciando viaje con datos:', {
                rutaId: viajeSeleccionado.rutaId
            });
    
            const response = await iniciarViaje({
                rutaId: viajeSeleccionado.rutaId,
            });
    
            console.log('Respuesta iniciar viaje:', response);
    
            if (!response?.viajeId || !response?.ubicacionConductorId) {
                throw new Error('No se recibieron los datos necesarios del servidor');
            }
    
            // Actualizar el estado con los datos del viaje iniciado
            const viajeIniciado = {
                ...viajeSeleccionado,
                id: response.viajeId,
                ubicacionConductorId: response.ubicacionConductorId,
                estado: 'EN_CURSO'
            };
    
            console.log('Viaje iniciado:', viajeIniciado);
    
            setViajeActivo(viajeIniciado);
            iniciarTracking(viajeIniciado.ubicacionConductorId);
            toast.success('Viaje iniciado correctamente');
        } catch (err) {
            console.error('Error al iniciar viaje:', err);
            toast.error('Error al iniciar el viaje: ' + (err.message || 'Error desconocido'));
        }
    };
    


    // Finalizar viaje
    const finalizarViajeHandler = async () => {
        if (!viajeActivo?.id) {
            toast.error('No hay un viaje activo para finalizar');
            return;
        }
    
        try {
            await finalizarViaje(viajeActivo.id);
            detenerTracking();
            
            // Actualizar estado del viaje
            setViajeActivo(prevViaje => ({
                ...prevViaje,
                estado: 'FINALIZADO'
            }));
    
            toast.success('Viaje finalizado correctamente');
            
            // Mostrar modal de calificación
            setMostrarCalificacion(true);
        } catch (err) {
            console.error('Error al finalizar viaje:', err);
            toast.error('Error al finalizar el viaje');
        }
    };
    

    // Cleanup al desmontar

    useEffect(() => {
        cargarViajesHoy();
    }, [cargarViajesHoy]);
    
    useEffect(() => {
        return () => {
            detenerTracking();
        };
    }, [detenerTracking]);


    // Handler para permisos de ubicación
    const handleLocationGranted = useCallback((initialLocation) => {
        setLocationPermissionGranted(true);
        setUbicacionActual(initialLocation);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-6">Viaje Activo</h2>
            
            <div className="absolute top-4 right-4">
                <EstadoConexion conectado={isConnected && !!ubicacionActual} />
            </div>

            {!viajeActivo && !locationPermissionGranted && (
                <LocationPermissionHandler 
                    onLocationGranted={handleLocationGranted}
                />
            )}

            {locationPermissionGranted && !viajeActivo && (
                <SelectorTipoRuta 
                    tipoRuta={tipoRuta} 
                    setTipoRuta={setTipoRuta} 
                />
            )}

            {!viajeActivo ? (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Viajes Programados para Hoy - {tipoRuta === 'E' ? 'Escuela a Casa' : 'Casa a Escuela'}
                    </h3>
                    
                    <ListaViajes 
                        viajesHoy={viajesHoy}
                        viajeSeleccionado={viajeSeleccionado}
                        setViajeSeleccionado={setViajeSeleccionado}
                        tipoRuta={tipoRuta}
                    />

                    {viajeSeleccionado && (
                        <div>
                            <p className="text-sm text-gray-600 mb-2">
                                Viaje seleccionado: {viajeSeleccionado.nombreRuta}
                                {viajeSeleccionado.id && ` (ID: ${viajeSeleccionado.id})`}
                            </p>
                            <button
                                onClick={iniciarViajeHandler}
                                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Comenzar Viaje
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <MapaViaje 
                        ubicacionActual={ubicacionActual}
                        ruta={viajeActivo}
                        isTracking={isConnected}
                    />
                    <button
                        onClick={finalizarViajeHandler}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Finalizar Viaje
                    </button>
                </div>
            )}

            {mostrarCalificacion && viajeActivo && (
                <CalificacionModal
                    viaje={viajeActivo}
                    onClose={() => {
                        setMostrarCalificacion(false);
                        setViajeActivo(null);
                        setViajeSeleccionado(null);
                        cargarViajesHoy();
                    }}
                    onCalificar={async (calificaciones) => {
                        try {
                            await Promise.all(
                                calificaciones.map(calificacion =>
                                    calificarPasajero({
                                        viajeId: viajeActivo.id,
                                        pasajeroId: calificacion.pasajeroId,
                                        calificacion: calificacion.calificacion,
                                        comentario: calificacion.comentario || ''
                                    })
                                )
                            );
                            
                            toast.success('Calificaciones enviadas correctamente');
                            setMostrarCalificacion(false);
                            setViajeActivo(prevViaje => ({
                                ...prevViaje,
                                calificadoPorConductor: true
                            }));
                        } catch (error) {
                            console.error('Error:', error);
                            toast.error('Error al enviar las calificaciones');
                        }
                    }}
                />
            )}

        </div>
    );
};

export default ViajeActivo;