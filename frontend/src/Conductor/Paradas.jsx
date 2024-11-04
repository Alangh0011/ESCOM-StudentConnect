// Paradas.jsx
import React from 'react';

const Paradas = ({ index, parada, actualizarParada }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    actualizarParada(index, { ...parada, [name]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold">Parada {index + 1}</h3>
      <div className="mt-2">
        <label className="block font-medium">Nombre de la Parada</label>
        <input
          type="text"
          name="paradaNombre"
          value={parada.paradaNombre || ''}
          onChange={handleChange}
          className="border rounded w-full p-2"
        />
      </div>
      <div className="mt-2">
        <label className="block font-medium">Distancia desde la Parada anterior (km)</label>
        <input
          type="number"
          name="distanciaParada"
          value={parada.distanciaParada || ''}
          onChange={handleChange}
          className="border rounded w-full p-2"
          min="0"
        />
      </div>
    </div>
  );
};

export default Paradas;
