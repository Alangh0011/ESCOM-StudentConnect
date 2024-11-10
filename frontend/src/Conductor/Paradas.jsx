// Paradas.jsx
import React, { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const Paradas = ({ index, parada, actualizarParada }) => {
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      const placeName = place.name || place.formatted_address || '';

      actualizarParada(index, {
        paradaNombre: placeName,
        paradaLat: latitude,
        paradaLng: longitude,
        distanciaParada: parada.distanciaParada || '',
        costoParada: parada.costoParada || '',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold">Parada {index + 1}</h3>
      <div className="mt-2">
        <label className="block font-medium">Nombre de la Parada</label>
        <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
          <input
            type="text"
            name="paradaNombre"
            value={parada.paradaNombre || ''}
            onChange={(e) => actualizarParada(index, { ...parada, paradaNombre: e.target.value })}
            className="border rounded w-full p-2"
            placeholder="Ingresa el nombre de la parada"
          />
        </Autocomplete>
      </div>
      <div className="mt-2">
        <label className="block font-medium">Distancia desde la Parada anterior (km)</label>
        <p className="border rounded w-full p-2 bg-gray-100">{parada.distanciaParada || 'Calculando...'}</p>
      </div>
    </div>
  );
};

export default Paradas; // Agrega esta línea si aún no está
