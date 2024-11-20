import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { AlertCircle } from 'lucide-react';
import { obtenerUltimaUbicacion } from '../api/services';

const RealtimeMap = ({ viajeId, rutaInicio, rutaFin, isActive = true }) => {
  const [ubicacion, setUbicacion] = useState(null);
  const [ruta, setRuta] = useState(null);
  const [error, setError] = useState(null);
  
  const cargarRuta = useCallback(async () => {
    if (!rutaInicio || !rutaFin) return;
    
    const directionsService = new window.google.maps.DirectionsService();
    try {
      const result = await directionsService.route({
        origin: { lat: rutaInicio.lat, lng: rutaInicio.lng },
        destination: { lat: rutaFin.lat, lng: rutaFin.lng },
        travelMode: google.maps.TravelMode.DRIVING
      });
      setRuta(result);
    } catch (err) {
      setError('Error al cargar la ruta');
    }
  }, [rutaInicio, rutaFin]);

  const actualizarUbicacion = useCallback(async () => {
    if (!viajeId || !isActive) return;
    
    try {
      const data = await obtenerUltimaUbicacion(viajeId);
      if (data && data.lat && data.lng) {
        setUbicacion({
          lat: Number(data.lat),
          lng: Number(data.lng),
          timestamp: new Date(data.timestamp)
        });
      }
    } catch (err) {
      setError('Error al actualizar ubicación');
    }
  }, [viajeId, isActive]);

  useEffect(() => {
    cargarRuta();
  }, [cargarRuta]);

  useEffect(() => {
    if (!isActive) return;
    
    actualizarUbicacion();
    const intervalo = setInterval(actualizarUbicacion, 5000);
    return () => clearInterval(intervalo);
  }, [actualizarUbicacion, isActive]);

  if (!rutaInicio || !rutaFin) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
          <p>No hay coordenadas disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] relative">
      <GoogleMap
        mapContainerClassName="w-full h-full rounded-lg"
        center={ubicacion || rutaInicio}
        zoom={15}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >
        {/* Marcador del conductor */}
        {ubicacion && (
          <Marker
            position={ubicacion}
            icon={{
              url: '/vehicle-marker.png',
              scaledSize: new google.maps.Size(40, 40)
            }}
          />
        )}

        {/* Ruta trazada */}
        {ruta && (
          <DirectionsRenderer
            directions={ruta}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#4285F4',
                strokeWeight: 5
              }
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default RealtimeMap;