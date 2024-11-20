import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Map, Navigation, Star, User, Clock } from 'lucide-react';
import { useGoogleMaps } from '../../GoogleMapsContext';
import CalificacionModal from './CalificacionModal';
import { toast } from 'react-toastify';
import { obtenerUltimaUbicacion, calificarConductor, obtenerViajeActivo, obtenerDetallesViaje  } from '../../utils/rutaAPI';


const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
};

// Coordenadas por defecto (ESCOM)
const DEFAULT_CENTER = {
    lat: 19.504394764401038,
    lng: -99.14698680254465
};

const POLLING_INTERVAL = 5000; // 5 segundos

const SeguimientoViaje = ({ userId, viaje, onViajeUpdate }) => {
    const [ubicacionConductor, setUbicacionConductor] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mostrarCalificacion, setMostrarCalificacion] = useState(false);
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [directions, setDirections] = useState(null);
    const { isLoaded } = useGoogleMaps();

    const verificarEstadoViaje = useCallback(async () => {
        try {
            const detallesViaje = await obtenerDetallesViaje(viaje.viajeId);
            console.log('Estado actual del viaje:', detallesViaje.estado);

            // Si el estado cambió a FINALIZADO y no está calificado
            if (detallesViaje.estado === 'FINALIZADO' && !detallesViaje.calificado) {
                if (onViajeUpdate) {
                    onViajeUpdate({
                        ...viaje,
                        estado: 'FINALIZADO'
                    });
                }
                setMostrarCalificacion(true);
                return true; // El viaje ha finalizado
            }
            return false; // El viaje aún está en curso
        } catch (error) {
            console.error('Error al verificar estado del viaje:', error);
            return false;
        }
    }, [viaje, onViajeUpdate]);

    useEffect(() => {
        if (!viaje || !userId || viaje.estado === 'FINALIZADO') return;

        console.log('Iniciando verificación periódica del viaje:', viaje.viajeId);
        const checkViaje = async () => {
            try {
                const viajeActualizado = await obtenerViajeActivo(userId);
                console.log('Estado del viaje actualizado:', viajeActualizado?.estado);

                if (viajeActualizado?.estado === 'FINALIZADO' && !viaje.calificado) {
                    onViajeUpdate({
                        ...viaje,
                        estado: 'FINALIZADO'
                    });
                    setMostrarCalificacion(true);
                }
            } catch (error) {
                console.error('Error al verificar estado:', error);
            }
        };

        const interval = setInterval(checkViaje, 5000);
        return () => clearInterval(interval);
    }, [viaje, userId, onViajeUpdate]);

    useEffect(() => {
        if (!viaje || viaje.estado === 'FINALIZADO') return;

        const interval = setInterval(async () => {
            const finalizado = await verificarEstadoViaje();
            if (finalizado) {
                clearInterval(interval);
            }
        }, POLLING_INTERVAL);

        return () => clearInterval(interval);
    }, [verificarEstadoViaje, viaje]);

    // Efecto para manejar el cambio de estado inicial
    useEffect(() => {
        if (viaje?.estado === 'FINALIZADO' && !viaje.calificado) {
            setMostrarCalificacion(true);
        }
    }, [viaje?.estado, viaje?.calificado]);

    // Actualizar centro del mapa cuando cambia la ubicación
    useEffect(() => {
        if (ubicacionConductor) {
            setMapCenter({
                lat: Number(ubicacionConductor.lat),
                lng: Number(ubicacionConductor.lng)
            });
        } else if (viaje?.puntoInicioLat && viaje?.puntoInicioLng) {
            setMapCenter({
                lat: Number(viaje.puntoInicioLat),
                lng: Number(viaje.puntoInicioLng)
            });
        }
    }, [ubicacionConductor, viaje]);

    // Calcular ruta
    useEffect(() => {
        if (!isLoaded || !viaje || !window.google) return;

        if (viaje.puntoInicioLat && viaje.puntoInicioLng && viaje.puntoFinalLat && viaje.puntoFinalLng) {
            const directionsService = new window.google.maps.DirectionsService();

            directionsService.route({
                origin: { lat: Number(viaje.puntoInicioLat), lng: Number(viaje.puntoInicioLng) },
                destination: { lat: Number(viaje.puntoFinalLat), lng: Number(viaje.puntoFinalLng) },
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === 'OK') {
                    setDirections(result);
                }
            });
        }
    }, [isLoaded, viaje]);

    useEffect(() => {
        console.log('Estado del viaje:', viaje?.estado);
        if (viaje?.estado === 'FINALIZADO' && !viaje.calificado) {
            console.log('Mostrando modal de calificación');
            setMostrarCalificacion(true);
        }
    }, [viaje?.estado, viaje?.calificado]);

    const handleCalificar = async (calificacion) => {
        try {
            console.log('Enviando calificación del conductor:', {
                viajeId: viaje.viajeId,
                pasajeroId: userId,
                calificacion
            });
    
            await calificarConductor({
                viajeId: viaje.viajeId,
                pasajeroId: userId,
                calificacion: calificacion.calificacion,
                comentario: calificacion.comentario || ''
            });
    
            toast.success('¡Gracias por calificar tu viaje!');
            setMostrarCalificacion(false);
            
            if (onViajeUpdate) {
                onViajeUpdate({
                    ...viaje,
                    calificado: true,
                    estado: 'FINALIZADO'
                });
            }
        } catch (error) {
            console.error('Error al calificar:', error);
            toast.error('No se pudo enviar la calificación. Inténtalo de nuevo.');
        }
    };

    const actualizarUbicacion = useCallback(async () => {
        if (!viaje?.viajeId) return;

        try {
            const data = await obtenerUltimaUbicacion(viaje.viajeId);
            if (data && data.lat && data.lng) {
                setUbicacionConductor({
                    lat: Number(data.lat),
                    lng: Number(data.lng),
                    timestamp: new Date(data.timestamp)
                });
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener la ubicación del conductor');
            setIsLoading(false);
        }
    }, [viaje?.viajeId]);

    useEffect(() => {
        if (!viaje || viaje.estado !== 'EN_CURSO') {
            setIsLoading(false);
            return;
        }

        actualizarUbicacion();
        const intervalo = setInterval(actualizarUbicacion, 5000);
        return () => clearInterval(intervalo);
    }, [actualizarUbicacion, viaje]);

    if (!isLoaded) {
        return <div className="text-center py-8">Cargando mapa...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Info del conductor y estado del viaje */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <User className="h-8 w-8 text-gray-400" />
                        <div>
                            <h3 className="font-medium">{viaje.nombreConductor}</h3>
                            <div className="flex items-center text-sm">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span>{viaje.calificacionConductor.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                        viaje.estado === 'EN_CURSO' ? 'bg-green-100 text-green-800' :
                        viaje.estado === 'FINALIZADO' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                        {viaje.estado}
                    </span>
                </div>
            </div>

            {/* Mapa */}
            <div className="h-[400px] relative rounded-lg overflow-hidden border border-gray-200">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={15}
                    options={{
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false
                    }}
                >
                    {ubicacionConductor && (
                        <Marker
                            position={ubicacionConductor}
                            icon={{
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                fillColor: "#4285F4",
                                fillOpacity: 1,
                                strokeColor: "#FFFFFF",
                                strokeWeight: 2,
                            }}
                        />
                    )}
                    {directions && (
                        <DirectionsRenderer
                            directions={directions}
                            options={{
                                suppressMarkers: true,
                                polylineOptions: {
                                    strokeColor: "#4285F4",
                                    strokeWeight: 4
                                }
                            }}
                        />
                    )}
                </GoogleMap>
            </div>

            {/* Info de la parada */}
            <div className="bg-white rounded-lg shadow p-4">
                <h4 className="font-medium mb-2">Tu parada</h4>
                <p className="text-gray-600">{viaje.paradaNombre}</p>
                {ubicacionConductor && (
                    <p className="text-sm text-gray-500 mt-2">
                        Última actualización: {new Date(ubicacionConductor.timestamp).toLocaleTimeString()}
                    </p>
                )}
            </div>

            {/* Modal de Calificación */}
            {mostrarCalificacion && (
                <CalificacionModal
                    isOpen={true}
                    onClose={() => setMostrarCalificacion(false)}
                    onCalificar={handleCalificar}
                />
            )}
        </div>
    );
};

export default SeguimientoViaje;