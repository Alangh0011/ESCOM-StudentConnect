import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Map, Navigation, Star, User, Clock } from 'lucide-react';
import { useGoogleMaps } from '../../GoogleMapsContext';
import CalificacionModal from './CalificacionModal';
import { toast } from 'react-toastify';
import { 
    obtenerUltimaUbicacion, 
    calificarConductor, 
    verificarEstadoCalificaciones 
} from '../../utils/rutaAPI';

// Constantes
const POLLING_INTERVAL = 5000;
const DEFAULT_CENTER = {
    lat: 19.504394764401038,
    lng: -99.14698680254465
};

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
};

const SeguimientoViaje = ({ userId, viaje, onViajeUpdate }) => {
    // Estados
    const [ubicacionConductor, setUbicacionConductor] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mostrarCalificacion, setMostrarCalificacion] = useState(false);
    const [calificacionPendiente, setCalificacionPendiente] = useState(false);
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [directions, setDirections] = useState(null);
    const { isLoaded } = useGoogleMaps();

    // Funciones de utilidad
    const actualizarMapCenter = useCallback((lat, lng) => {
        setMapCenter({
            lat: Number(lat),
            lng: Number(lng)
        });
    }, []);

    // Verificación del estado del viaje
    const verificarEstadoViaje = useCallback(async () => {
        if (!viaje?.viajeId) return;

        try {
            const estadoViaje = await verificarEstadoCalificaciones(viaje.viajeId);
            console.log('Estado del viaje:', estadoViaje);

            if (estadoViaje.estado === 'FINALIZADO' && !estadoViaje.calificadoPorPasajero) {
                setCalificacionPendiente(true);
                setMostrarCalificacion(true);
                onViajeUpdate?.({
                    ...viaje,
                    estado: 'FINALIZADO'
                });
            }
        } catch (error) {
            console.error('Error al verificar estado del viaje:', error);
        }
    }, [viaje, onViajeUpdate]);

    // Actualización de ubicación
    const actualizarUbicacion = useCallback(async () => {
        if (!viaje?.viajeId || viaje.estado !== 'EN_CURSO') return;

        try {
            const data = await obtenerUltimaUbicacion(viaje.viajeId);
            if (data?.lat && data?.lng) {
                setUbicacionConductor({
                    lat: Number(data.lat),
                    lng: Number(data.lng),
                    timestamp: new Date(data.timestamp)
                });
                actualizarMapCenter(data.lat, data.lng);
            }
        } catch (error) {
            console.error('Error al actualizar ubicación:', error);
            setError('Error al obtener la ubicación del conductor');
        } finally {
            setIsLoading(false);
        }
    }, [viaje, actualizarMapCenter]);

    // Manejo de calificación
    const handleCalificar = async (calificacionData) => {
        try {
            await calificarConductor({
                viajeId: viaje.viajeId,
                pasajeroId: userId,
                calificacion: calificacionData.calificacion,
                comentario: calificacionData.comentario || ''
            });

            toast.success('¡Gracias por calificar tu viaje!');
            setMostrarCalificacion(false);
            setCalificacionPendiente(false);

            onViajeUpdate?.({
                ...viaje,
                calificadoPorPasajero: true,
                estado: 'FINALIZADO'
            });
        } catch (error) {
            console.error('Error al calificar:', error);
            toast.error('Error al enviar la calificación');
        }
    };

    // Efectos
    useEffect(() => {
        if (!viaje || viaje.estado === 'FINALIZADO') return;

        const intervalEstado = setInterval(verificarEstadoViaje, POLLING_INTERVAL);
        return () => clearInterval(intervalEstado);
    }, [verificarEstadoViaje, viaje]);

    useEffect(() => {
        if (!viaje || viaje.estado !== 'EN_CURSO') {
            setIsLoading(false);
            return;
        }

        actualizarUbicacion();
        const intervalUbicacion = setInterval(actualizarUbicacion, POLLING_INTERVAL);
        return () => clearInterval(intervalUbicacion);
    }, [actualizarUbicacion, viaje]);

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

    if (!isLoaded) {
        return <div className="text-center py-8">Cargando mapa...</div>;
    }

    const getEstadoClassName = (estado) => {
        switch (estado) {
            case 'EN_CURSO':
                return 'bg-green-100 text-green-800';
            case 'FINALIZADO':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

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
                    <span className={`px-3 py-1 rounded-full text-sm ${getEstadoClassName(viaje.estado)}`}>
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
            {mostrarCalificacion && calificacionPendiente && (
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