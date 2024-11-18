import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { MapPin, Navigation } from 'lucide-react';
import CalificacionModal  from './CalificacionModal.jsx';
import { 
    obtenerUltimaUbicacion, 
    obtenerDetallesViaje,
    calificarConductor 
} from '../../utils/rutaAPI';
import { toast } from 'react-toastify';

const SeguimientoViaje = ({ userId, viajeId }) => {
    const [viaje, setViaje] = useState(null);
    const [ubicacionConductor, setUbicacionConductor] = useState(null);
    const [ruta, setRuta] = useState(null);
    const [error, setError] = useState(null);
    const [mostrarCalificacion, setMostrarCalificacion] = useState(false);

    // Obtener datos iniciales del viaje
    useEffect(() => {
        const cargarDetallesViaje = async () => {
            try {
                const detallesViaje = await obtenerDetallesViaje(viajeId);
                setViaje(detallesViaje);
                
                // Configurar ruta en el mapa
                if (detallesViaje.puntoInicioLat && detallesViaje.puntoFinalLat) {
                    const directionsService = new window.google.maps.DirectionsService();
                    const result = await directionsService.route({
                        origin: { 
                            lat: parseFloat(detallesViaje.puntoInicioLat), 
                            lng: parseFloat(detallesViaje.puntoInicioLng) 
                        },
                        destination: { 
                            lat: parseFloat(detallesViaje.puntoFinalLat), 
                            lng: parseFloat(detallesViaje.puntoFinalLng) 
                        },
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    });
                    setRuta(result);
                }
            } catch (error) {
                console.error('Error al cargar detalles del viaje:', error);
                setError('No se pudieron cargar los detalles del viaje');
            }
        };

        cargarDetallesViaje();
    }, [viajeId]);

    // Actualizar ubicación del conductor
    const actualizarUbicacion = useCallback(async () => {
        try {
            const ubicacion = await obtenerUltimaUbicacion(viajeId);
            if (ubicacion && ubicacion.lat && ubicacion.lng) {
                setUbicacionConductor(ubicacion);
                setError(null);
            }
        } catch (error) {
            console.error('Error al obtener ubicación:', error);
            setError('No se pudo actualizar la ubicación del conductor');
        }
    }, [viajeId]);

    // Polling de ubicación
    useEffect(() => {
        if (!viaje || viaje.estado === 'FINALIZADO') return;

        actualizarUbicacion();
        const intervalo = setInterval(actualizarUbicacion, 5000);

        return () => clearInterval(intervalo);
    }, [actualizarUbicacion, viaje]);

    // Verificar si el viaje ha finalizado
    useEffect(() => {
        if (viaje?.estado === 'FINALIZADO' && !mostrarCalificacion) {
            setMostrarCalificacion(true);
        }
    }, [viaje?.estado]);

    if (!viaje) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Seguimiento de Viaje</h2>
                <p className="text-gray-600">{viaje.nombreRuta}</p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="relative h-96 rounded-lg overflow-hidden mb-6">
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={ubicacionConductor || {
                        lat: parseFloat(viaje.puntoInicioLat),
                        lng: parseFloat(viaje.puntoInicioLng)
                    }}
                    zoom={15}
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

                    {ruta && (
                        <DirectionsRenderer
                            directions={ruta}
                            options={{
                                suppressMarkers: true,
                                polylineOptions: {
                                    strokeColor: '#4285F4',
                                    strokeWeight: 5,
                                    strokeOpacity: 0.8
                                }
                            }}
                        />
                    )}
                </GoogleMap>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <MapPin className="text-blue-500" />
                        <span className="font-medium">Origen</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{viaje.puntoInicioNombre}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Navigation className="text-green-500" />
                        <span className="font-medium">Destino</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{viaje.puntoFinalNombre}</p>
                </div>
            </div>

            <div className="text-sm text-gray-600">
                <p>Estado: <span className={`font-medium ${
                    viaje.estado === 'EN_CURSO' ? 'text-green-600' : 
                    viaje.estado === 'FINALIZADO' ? 'text-gray-600' : 
                    'text-yellow-600'
                }`}>{viaje.estado}</span></p>
                {ubicacionConductor && (
                    <p className="mt-2">
                        Última actualización: {new Date().toLocaleTimeString()}
                    </p>
                )}
            </div>

            {mostrarCalificacion && (
                <CalificacionModal
                    viaje={viaje}
                    onClose={() => setMostrarCalificacion(false)}
                    onCalificar={async (calificacion) => {
                        try {
                            await calificarConductor({
                                viajeId: viaje.id,
                                pasajeroId: userId,
                                calificacion: calificacion.calificacion,
                                comentario: calificacion.comentario
                            });
                            toast.success('Calificación enviada exitosamente');
                            setMostrarCalificacion(false);
                        } catch (error) {
                            toast.error('Error al enviar la calificación');
                            console.error('Error:', error);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default SeguimientoViaje;