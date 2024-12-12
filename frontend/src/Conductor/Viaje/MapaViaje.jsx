import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const MapaViaje = ({ ubicacionActual, ruta, isTracking }) => {
    const mapRef = useRef(null);
    const [directions, setDirections] = useState(null);
    const [error, setError] = useState(null);

    // Definición de iconos personalizados
    const carIcon = {
        path: "M17.402,0H5.643C2.526,0,0,2.526,0,5.643v6.714C0,15.474,2.526,18,5.643,18h11.759C20.519,18,23,15.474,23,12.357V5.643C23,2.526,20.519,0,17.402,0z M8.21,13.18c-0.374,0.364-0.798,0.638-1.271,0.82c-0.474,0.183-0.984,0.273-1.531,0.273c-0.602,0-1.155-0.109-1.661-0.328c-0.506-0.219-0.939-0.528-1.299-0.927c-0.36-0.399-0.64-0.878-0.84-1.437C1.407,10.922,1.306,10.318,1.306,9.66c0-0.364,0.045-0.718,0.134-1.062c0.089-0.344,0.217-0.666,0.384-0.968c0.167-0.302,0.368-0.583,0.605-0.845c0.236-0.262,0.497-0.49,0.784-0.685c0.287-0.195,0.591-0.349,0.914-0.462c0.323-0.112,0.652-0.169,0.987-0.169c0.334,0,0.658,0.058,0.971,0.173c0.313,0.115,0.608,0.271,0.887,0.467c0.279,0.196,0.531,0.427,0.757,0.693c0.226,0.266,0.412,0.547,0.56,0.843c0.148,0.296,0.262,0.608,0.342,0.936c0.08,0.328,0.12,0.665,0.12,1.011c0,0.711-0.149,1.372-0.447,1.983C9.756,12.366,9.333,12.815,8.21,13.18z M15.422,13.18c-0.374,0.364-0.798,0.638-1.271,0.82c-0.474,0.183-0.984,0.273-1.531,0.273c-0.602,0-1.155-0.109-1.661-0.328c-0.506-0.219-0.939-0.528-1.299-0.927c-0.36-0.399-0.64-0.878-0.84-1.437C8.62,10.922,8.52,10.318,8.52,9.66c0-0.364,0.045-0.718,0.134-1.062c0.089-0.344,0.217-0.666,0.384-0.968c0.167-0.302,0.368-0.583,0.605-0.845c0.236-0.262,0.497-0.49,0.784-0.685c0.287-0.195,0.591-0.349,0.914-0.462c0.323-0.112,0.652-0.169,0.987-0.169c0.334,0,0.658,0.058,0.971,0.173c0.313,0.115,0.608,0.271,0.887,0.467c0.279,0.196,0.531,0.427,0.757,0.693c0.226,0.266,0.412,0.547,0.56,0.843c0.148,0.296,0.262,0.608,0.342,0.936c0.08,0.328,0.12,0.665,0.12,1.011c0,0.711-0.149,1.372-0.447,1.983C16.969,12.366,16.546,12.815,15.422,13.18z",
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#FFFFFF",
        scale: 1.2,
        anchor: new window.google.maps.Point(11.5, 9)
    };

    const schoolIcon = {
        path: "M21 10h-2V4h2v6zm0 2v8h-2v-8h2zm-11.5 3h-2l1.15-3.15L3.35 7.05l1.3-.5L9.5 13h-2l1.15-3.15L3.35 7.05l1.3-.5L9.5 13zm5.5-5l4.55-3.25.7.25-2.75 7H15l4.55-3.25.7.25-2.75 7z",
        fillColor: "#EA4335",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#FFFFFF",
        scale: 1.5,
        anchor: new window.google.maps.Point(12, 23)
    };

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
                    setDirections(result);
                    setError(null);
                } else {
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
                        icon={carIcon}
                    />
                )}

                {ruta?.puntoFinalLat && ruta?.puntoFinalLng && (
                    <Marker
                        position={{
                            lat: parseFloat(ruta.puntoFinalLat),
                            lng: parseFloat(ruta.puntoFinalLng)
                        }}
                        icon={schoolIcon}
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