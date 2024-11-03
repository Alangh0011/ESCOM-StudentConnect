// Parada.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Parada = ({ rutaId, paradaIndex, onSave }) => {
  const [paradaData, setParadaData] = useState({
    paradaNombre: '',
    paradaLat: '',
    paradaLng: '',
    costoParada: 0,
  });

  const handleChange = (e) => {
    setParadaData({ ...paradaData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/rutas/${rutaId}/paradas`, paradaData);
      onSave(response.data); // Llama al callback para notificar que se guardó
    } catch (error) {
      console.error("Error al guardar la parada:", error);
    }
  };

  return (
    <div className="parada-card">
      <h3>Parada {paradaIndex + 1}</h3>
      <form onSubmit={handleSave}>
        <label>Nombre de la Parada:</label>
        <input type="text" name="paradaNombre" value={paradaData.paradaNombre} onChange={handleChange} required />

        <label>Latitud:</label>
        <input type="number" name="paradaLat" value={paradaData.paradaLat} onChange={handleChange} required />

        <label>Longitud:</label>
        <input type="number" name="paradaLng" value={paradaData.paradaLng} onChange={handleChange} required />

        <label>Costo de la Parada:</label>
        <input type="number" name="costoParada" value={paradaData.costoParada} onChange={handleChange} required />

        <button type="submit">Guardar Parada</button>
      </form>
    </div>
  );
};

export default Parada;
