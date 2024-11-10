import React, { useState, useEffect, useContext } from 'react';
import GoogleMapsContext from '../GoogleMapsContext';
import Paradas from './Paradas';
import { calcularCostoParada } from './Precio_Parada';

const ParadasControl = ({ rutaData }) => {
  const { isLoaded, loadError, googleMaps } = useContext(GoogleMapsContext); // Definir el contexto primero

  const [paradas, setParadas] = useState(
    Array.from({ length: rutaData.numeroParadas }, () => ({
      paradaNombre: '',
      paradaLat: null,
      paradaLng: null,
      costoParada: '',
    }))
  );

  const actualizarParada = (index, nuevaParada) => {
    const nuevasParadas = [...paradas];
    nuevasParadas[index] = nuevaParada;
    setParadas(nuevasParadas);
  };

  const calcularCostos = async () => {
    if (!isLoaded || !googleMaps) {
      console.error("Google Maps no está disponible.");
      return;
    }
  
    const todasCoordenadasValidas = paradas.every(
      parada => parada.paradaLat !== null && parada.paradaLng !== null
    );
  
    if (!todasCoordenadasValidas) {
      console.error("No todas las coordenadas están disponibles para calcular costos.");
      return;
    }
  
    try {
      const costosCalculados = await calcularCostoParada(
        paradas,
        rutaData.costoGasolina,
        rutaData.distancia,
        rutaData.puntoFinalLat,
        rutaData.puntoFinalLng,
        googleMaps
      );
  
      setParadas(costosCalculados); // Actualiza el estado de las paradas con distancia y costo
    } catch (error) {
      console.error("Error al calcular costos:", error);
    }
  };
  

  useEffect(() => {
    if (
      isLoaded &&
      googleMaps &&
      rutaData &&
      rutaData.puntoInicioLat &&
      rutaData.puntoInicioLng &&
      rutaData.puntoFinalLat &&
      rutaData.puntoFinalLng &&
      rutaData.costoGasolina &&
      rutaData.numeroParadas
    ) {
      calcularCostos();
    }
  }, [isLoaded, googleMaps, rutaData, paradas]);

  if (loadError) return <p>Error al cargar Google Maps: {loadError.message}</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Registrar Paradas</h2>
      {paradas.map((parada, index) => (
        <Paradas key={index} index={index} parada={parada} actualizarParada={actualizarParada} />
      ))}
      <button
        onClick={() => {
          if (isLoaded && googleMaps) {
            calcularCostos();
          } else {
            console.error("Google Maps no está disponible.");
          }
        }}
        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded mt-4"
      >
        Calcular Costo por Parada
      </button>
      <div className="mt-4">
        <h3 className="font-bold">Resumen de Costos:</h3>
        {paradas.map((parada, index) => (
          <p key={index}>
            Costo de Parada {index + 1}: ${parada.costoParada || 0}
          </p>
        ))}
      </div>
      <button className="bg-green-500 text-white font-semibold px-4 py-2 rounded mt-4">
        Confirmar y Enviar
      </button>
    </div>
  );
};

export default ParadasControl;
