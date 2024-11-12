import React, { useRef, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { validarNombreParada } from '../utils/validaciones';
const Paradas = ({ index, parada = {}, actualizarParada }) => {
  const autocompleteRef = useRef(null);
  const [error, setError] = useState('');

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      const placeName = place.name || place.formatted_address || '';

      if (!validarNombreParada(placeName)) {
        setError('La parada debe ser una estación de Metro, Metrobús, Mexibús, Suburbano, Cablebús, Mexicable o Trolebús');
        return;
      }

      setError('');
      actualizarParada(index, {
        ...parada,
        paradaNombre: placeName,
        paradaLat: latitude,
        paradaLng: longitude,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold">Parada {index + 1}</h3>
      <div className="mt-2">
        <label className="block font-medium">Nombre de la Parada</label>
        <Autocomplete 
          onLoad={(ref) => (autocompleteRef.current = ref)} 
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            name="paradaNombre"
            value={parada.paradaNombre || ''}
            onChange={(e) => actualizarParada(index, { 
              ...parada, 
              paradaNombre: e.target.value 
            })}
            className="border rounded w-full p-2"
            placeholder="Ingresa el nombre de la parada"
          />
        </Autocomplete>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
      <div className="mt-2">
        <label className="block font-medium">Distancia desde la Parada anterior (km)</label>
        <p className="border rounded w-full p-2 bg-gray-100">
          {parada.distanciaParada 
            ? `${parada.distanciaParada.toFixed(2)} km`
            : parada.paradaLat && parada.paradaLng 
              ? 'Calculando distancia...'
              : 'Esperando ubicación...'}
        </p>
      </div>
      <div className="mt-2">
        <label className="block font-medium">Costo de la Parada</label>
        <p className="border rounded w-full p-2 bg-gray-100">
          {parada.costoParada 
            ? `$${parseFloat(parada.costoParada).toFixed(2)}`
            : parada.paradaLat && parada.paradaLng
              ? 'Calculando costo...'
              : '$0.00'}
        </p>
      </div>
    </div>
  );
};

export default Paradas;