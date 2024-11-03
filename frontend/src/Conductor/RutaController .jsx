// RutaController.jsx
import React, { useEffect, useState } from 'react';
import Parada from './Parada';

const RutaController = ({ rutaData }) => {
  const [paradas, setParadas] = useState([]);
  const [savedParadas, setSavedParadas] = useState([]);
  
  useEffect(() => {
    // Genera una lista con el número de paradas basado en `numeroParadas`
    const paradaForms = Array.from({ length: rutaData.numeroParadas }, (_, i) => i);
    setParadas(paradaForms);
  }, [rutaData.numeroParadas]);

  const handleParadaSave = (paradaData) => {
    // Callback que se invoca cuando se guarda una parada
    setSavedParadas((prev) => [...prev, paradaData]);
    console.log("Parada guardada:", paradaData);
  };

  return (
    <div>
      <h2>Registrar Paradas para la Ruta "{rutaData.nombreRuta}"</h2>
      {paradas.map((index) => (
        <Parada key={index} rutaId={rutaData.id} paradaIndex={index} onSave={handleParadaSave} />
      ))}
    </div>
  );
};

export default RutaController;
