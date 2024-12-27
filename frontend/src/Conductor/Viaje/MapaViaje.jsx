import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';

const defaultCenter = {
    lat: 19.3738849,
    lng: -99.0059968
};

const MapaViaje = ({ ubicacionActual, ruta, isTracking }) => {
    const mapRef = useRef(null);
    const [directions, setDirections] = useState(null);
    const [error, setError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Estilo del contenedor del mapa
    const mapContainerStyle = {
        width: '100%',
        height: '100%',
        borderRadius: '0.5rem'
    };

    // Opciones básicas del mapa
    const mapOptions = {
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    };

    useEffect(() => {
        if (!mapLoaded || !ubicacionActual || !ruta || !window.google) return;

        if (!ruta.puntoFinalLat || !ruta.puntoFinalLng) {
            console.warn('Coordenadas del punto final no disponibles');
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: {
                    lat: parseFloat(ubicacionActual.lat),
                    lng: parseFloat(ubicacionActual.lng)
                },
                destination: {
                    lat: parseFloat(ruta.puntoFinalLat),
                    lng: parseFloat(ruta.puntoFinalLng)
                },
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK') {
                    setDirections(result);
                    setError(null);
                } else {
                    setError(`Error al calcular la ruta: ${status}`);
                    setDirections(null);
                }
            }
        );
    }, [ubicacionActual, ruta, mapLoaded]);

    const handleMapLoad = (map) => {
        mapRef.current = map;
        setMapLoaded(true);
    };

    return (
        <div className="relative h-96 rounded-lg overflow-hidden">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={ubicacionActual ? {
                    lat: parseFloat(ubicacionActual.lat),
                    lng: parseFloat(ubicacionActual.lng)
                } : defaultCenter}
                zoom={15}
                options={mapOptions}
                onLoad={handleMapLoad}
            >
                {ubicacionActual && (
                    <Marker
                        position={{
                            lat: parseFloat(ubicacionActual.lat),
                            lng: parseFloat(ubicacionActual.lng)
                        }}
                        icon={{
                            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0Mjg1RjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTggOEgxN1Y2QzE3IDMuMjQgMTQuNzYgMSAxMiAxQzkuMjQgMSA3IDMuMjQgNyA2VjhINkM0LjkgOCA0IDguOSA0IDEwVjIwQzQgMjEuMSA0LjkgMjIgNiAyMkgxOEMxOS4xIDIyIDIwIDIxLjEgMjAgMjBWMTBDMjAgOC45IDE5LjEgOCAxOCA4Wk05IDZDOSA0LjM0IDEwLjM0IDMgMTIgM0MxMy42NiAzIDE1IDQuMzQgMTUgNlY4SDlWNlptOSAxNEg2VjEwSDE4VjIwWk0xMiAxN0MxMy4xIDE3IDE0IDE2LjEgMTQgMTVDMTQgMTMuOSAxMy4xIDEzIDEyIDEzQzEwLjkgMTMgMTAgMTMuOSAxMCAxNUMxMCAxNi4xIDEwLjkgMTcgMTIgMTdaIi8+PC9zdmc+',
                            scaledSize: new window.google.maps.Size(32, 32)
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
                            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNFQTQzMzUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMyAxMkgyMU0zIDZIMjFNMyAxOEgyMSIvPjwvc3ZnPg==',
                            scaledSize: new window.google.maps.Size(32, 32)
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
                                strokeWeight: 5,
                                strokeOpacity: 0.8
                            }
                        }}
                    />
                )}
            </GoogleMap>

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