import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const MapaViaje = ({ ubicacionActual, ruta, isTracking }) => {
    const mapRef = useRef(null);
    const [directions, setDirections] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!ubicacionActual || !ruta || !window.google) return;

        if (!ruta.puntoFinalLat || !ruta.puntoFinalLng) {
            console.warn('Coordenadas del punto final no disponibles:', {
                puntoFinalLat: ruta.puntoFinalLat,
                puntoFinalLng: ruta.puntoFinalLng
            });
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();

        const destination = {
            lat: parseFloat(ruta.puntoFinalLat),
            lng: parseFloat(ruta.puntoFinalLng)
        };

        console.log('Calculando ruta desde:', ubicacionActual, 'hasta:', destination);

        directionsService.route(
            {
                origin: new window.google.maps.LatLng(
                    parseFloat(ubicacionActual.lat),
                    parseFloat(ubicacionActual.lng)
                ),
                destination: new window.google.maps.LatLng(
                    destination.lat,
                    destination.lng
                ),
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK') {
                    console.log('Ruta calculada exitosamente');
                    setDirections(result);
                    setError(null);
                } else {
                    console.error('Error al calcular ruta:', status);
                    setError(`Error al calcular la ruta: ${status}`);
                    setDirections(null);
                }
            }
        );
    }, [ubicacionActual, ruta]);

    return (
        <div className="relative h-96 rounded-lg overflow-hidden">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={ubicacionActual ? {
                    lat: parseFloat(ubicacionActual.lat),
                    lng: parseFloat(ubicacionActual.lng)
                } : { lat: 19.3738849, lng: -99.0059968 }}
                zoom={15}
                options={{
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                }}
                onLoad={map => {
                    mapRef.current = map;
                }}
            >
                {ubicacionActual && (
                <Marker
                    position={{
                        lat: parseFloat(ubicacionActual.lat),
                        lng: parseFloat(ubicacionActual.lng)
                    }}
                    icon={{
                        path: 'M23 0c-4.5 0-8 3.5-8 8 0 1.4.4 2.6 1 3.7l7 15.3 7-15.3c.6-1.1 1-2.3 1-3.7 0-4.5-3.5-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z',
                        fillColor: '#4285F4',
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: '#FFFFFF',
                        scale: 1,
                        anchor: new window.google.maps.Point(23, 23)
                    }}
                />
            )}

            {ruta?.puntoFinalLat && ruta?.puntoFinalLng && (
                <Marker
                    position={{
                        lat: parseFloat(ruta.puntoFinalLat),
                        lng: parseFloat(ruta.puntoFinalLng)
                    }}
                    icon={{
                        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                        fillColor: '#EA4335',
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: '#FFFFFF',
                        scale: 1.5,
                        anchor: new window.google.maps.Point(12, 23)
                    }}
                />
            )}

                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            suppressMarkers: true, // Usamos nuestros propios marcadores
                            polylineOptions: {
                                strokeColor: "#4285F4",
                                strokeWeight: 5,
                                strokeOpacity: 0.8
                            }
                        }}
                    />
                )}
            </GoogleMap>

            {/* Panel de información */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                        isTracking ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium">
                        {isTracking ? 'Ubicación activa' : 'Sin ubicación'}
                    </span>
                </div>
                {ubicacionActual && (
                    <>
                        <div className="text-xs text-gray-600">
                            <div>Lat: {ubicacionActual.lat.toFixed(6)}</div>
                            <div>Lng: {ubicacionActual.lng.toFixed(6)}</div>
                            <div>Última actualización: {new Date().toLocaleTimeString()}</div>
                        </div>
                        {ruta?.puntoFinalNombre && (
                            <div className="mt-2 text-xs text-blue-600">
                                Destino: {ruta.puntoFinalNombre}
                            </div>
                        )}
                    </>
                )}
                {error && (
                    <div className="mt-2 text-xs text-red-500">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapaViaje;