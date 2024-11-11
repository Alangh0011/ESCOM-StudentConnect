import React, { useState, useContext } from 'react';
import GoogleMapsContext from '../GoogleMapsContext';
import Paradas from './Paradas';
import { calcularCostoParada, calcularDistanciaEntrePuntos } from './Precio_Parada';
import { actualizarDistanciaTotal } from './rutaAPI';

const ParadasControl = ({ rutaData }) => {
  const { isLoaded, loadError, googleMaps } = useContext(GoogleMapsContext);
  const [paradas, setParadas] = useState(
    Array.from({ length: rutaData.numeroParadas }, () => ({
      paradaNombre: '',
      paradaLat: null,
      paradaLng: null,
      costoParada: '',
    }))
  );
  const [distanciaTotal, setDistanciaTotal] = useState(0);
  const [costosCalculados, setCostosCalculados] = useState([]);

  const actualizarParada = (index, nuevaParada) => {
    const nuevasParadas = [...paradas];
    nuevasParadas[index] = nuevaParada;
    setParadas(nuevasParadas);
  };

  const calcularDistanciaTotal = async () => {
    if (!googleMaps) {
      console.error("Google Maps no está disponible.");
      return;
    }

    let distanciaAcumulada = 0;

    try {
      // Calcular la distancia desde el punto de inicio hasta la primera parada
      if (paradas[0].paradaLat && paradas[0].paradaLng && rutaData.puntoInicioLat && rutaData.puntoInicioLng) {
        const distanciaInicioAPrimeraParada = await calcularDistanciaEntrePuntos(
          googleMaps,
          { paradaLat: rutaData.puntoInicioLat, paradaLng: rutaData.puntoInicioLng },
          paradas[0]
        );
        distanciaAcumulada += distanciaInicioAPrimeraParada;
      }

      // Calcular las distancias entre paradas consecutivas
      for (let i = 0; i < paradas.length - 1; i++) {
        const origen = paradas[i];
        const destino = paradas[i + 1];
        if (origen.paradaLat && origen.paradaLng && destino.paradaLat && destino.paradaLng) {
          const distanciaEntreParadas = await calcularDistanciaEntrePuntos(googleMaps, origen, destino);
          distanciaAcumulada += distanciaEntreParadas;
        }
      }

      // Calcular la distancia desde la última parada hasta el destino final
      const ultimaParada = paradas[paradas.length - 1];
      if (ultimaParada.paradaLat && ultimaParada.paradaLng && rutaData.puntoFinalLat && rutaData.puntoFinalLng) {
        const distanciaUltimaParadaAFinal = await calcularDistanciaEntrePuntos(googleMaps, ultimaParada, {
          paradaLat: rutaData.puntoFinalLat,
          paradaLng: rutaData.puntoFinalLng,
        });
        distanciaAcumulada += distanciaUltimaParadaAFinal;
      }

      setDistanciaTotal(distanciaAcumulada);

      // Actualizar la distancia total en la base de datos
      await actualizarDistanciaTotal(rutaData.rutaId, distanciaAcumulada);
      console.log("Distancia total actualizada en el backend:", distanciaAcumulada);
    } catch (error) {
      console.error("Error al calcular la distancia total:", error);
    }
  };

  const handleCalcularDistanciaYCostos = async () => {
    if (!isLoaded || !googleMaps) {
      console.error("Google Maps API no está completamente cargada.");
      return;
    }

    await calcularDistanciaTotal();

    try {
      const costos = await calcularCostoParada(
        paradas,
        rutaData.costoGasolina,
        distanciaTotal,
        rutaData.puntoInicioLat,
        rutaData.puntoInicioLng,
        rutaData.puntoFinalLat,
        rutaData.puntoFinalLng,
        googleMaps,
        rutaData.tipoRuta
      );
      setCostosCalculados(costos);
      console.log("Costos calculados por parada:", costos);
    } catch (error) {
      console.error("Error al calcular costos por parada:", error);
    }
  };

  if (loadError) return <p>Error al cargar Google Maps: {loadError.message}</p>;

  return (
    <div>
      {paradas.map((parada, index) => (
        <Paradas key={index} index={index} parada={parada} actualizarParada={actualizarParada} />
      ))}
      <button
        onClick={handleCalcularDistanciaYCostos}
        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded mt-4"
      >
        Calcular Distancia y Costos
      </button>
      <div className="mt-4">
        <h3 className="font-bold">Resumen de Costos y Distancia:</h3>
        <p>Distancia Total: {distanciaTotal.toFixed(2)} km</p>
        {costosCalculados.map((parada, index) => (
          <p key={index}>
            Costo de Parada {index + 1}: ${parada.costoParada || 0}
          </p>
        ))}
      </div>
      <button
        className="bg-green-500 text-white font-semibold px-4 py-2 rounded mt-4"
        disabled={!distanciaTotal || costosCalculados.length === 0}
      >
        Confirmar y Enviar
      </button>
    </div>
  );
};

export default ParadasControl;
