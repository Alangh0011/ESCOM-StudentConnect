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
    if (!isLoaded) {
      console.error("Google Maps no está disponible.");
      return;
    }
  
    let distanciaAcumulada = 0;
    const directionsService = new window.google.maps.DirectionsService();
  
    try {
      // 1. Calcular distancia desde punto inicial a primera parada
      if (paradas[0]?.paradaLat && paradas[0]?.paradaLng) {
        const resultadoInicial = await new Promise((resolve, reject) => {
          directionsService.route({
            origin: { 
              lat: parseFloat(rutaData.puntoInicioLat), 
              lng: parseFloat(rutaData.puntoInicioLng) 
            },
            destination: { 
              lat: parseFloat(paradas[0].paradaLat), 
              lng: parseFloat(paradas[0].paradaLng) 
            },
            travelMode: window.google.maps.TravelMode.DRIVING
          }, (result, status) => {
            if (status === "OK") {
              resolve(result);
            } else {
              reject(status);
            }
          });
        });
  
        distanciaAcumulada += resultadoInicial.routes[0].legs[0].distance.value / 1000;
        console.log("Distancia inicial:", distanciaAcumulada);
      }
  
      // 2. Calcular distancias entre paradas consecutivas
      for (let i = 0; i < paradas.length - 1; i++) {
        if (paradas[i].paradaLat && paradas[i].paradaLng && 
            paradas[i + 1].paradaLat && paradas[i + 1].paradaLng) {
          const resultadoEntreParadas = await new Promise((resolve, reject) => {
            directionsService.route({
              origin: { 
                lat: parseFloat(paradas[i].paradaLat), 
                lng: parseFloat(paradas[i].paradaLng) 
              },
              destination: { 
                lat: parseFloat(paradas[i + 1].paradaLat), 
                lng: parseFloat(paradas[i + 1].paradaLng) 
              },
              travelMode: window.google.maps.TravelMode.DRIVING
            }, (result, status) => {
              if (status === "OK") {
                resolve(result);
              } else {
                reject(status);
              }
            });
          });
  
          distanciaAcumulada += resultadoEntreParadas.routes[0].legs[0].distance.value / 1000;
          console.log(`Distancia entre paradas ${i} y ${i + 1}:`, distanciaAcumulada);
        }
      }
  
      // 3. Calcular distancia desde última parada hasta punto final
      if (paradas[paradas.length - 1]?.paradaLat && paradas[paradas.length - 1]?.paradaLng) {
        const resultadoFinal = await new Promise((resolve, reject) => {
          directionsService.route({
            origin: { 
              lat: parseFloat(paradas[paradas.length - 1].paradaLat), 
              lng: parseFloat(paradas[paradas.length - 1].paradaLng) 
            },
            destination: { 
              lat: parseFloat(rutaData.puntoFinalLat), 
              lng: parseFloat(rutaData.puntoFinalLng) 
            },
            travelMode: window.google.maps.TravelMode.DRIVING
          }, (result, status) => {
            if (status === "OK") {
              resolve(result);
            } else {
              reject(status);
            }
          });
        });
  
        distanciaAcumulada += resultadoFinal.routes[0].legs[0].distance.value / 1000;
        console.log("Distancia final acumulada:", distanciaAcumulada);
      }
  
      // 4. Actualizar estado y backend
      setDistanciaTotal(distanciaAcumulada);
      await actualizarDistanciaTotal(rutaData.rutaId, distanciaAcumulada);
      console.log("Distancia total calculada y actualizada:", distanciaAcumulada);
      
      return distanciaAcumulada;
  
    } catch (error) {
      console.error("Error al calcular la distancia total:", error);
      throw error;
    }
  };

  // Modificación en handleCalcularDistanciaYCostos
const handleCalcularDistanciaYCostos = async () => {
  if (!isLoaded) {
    console.error("Google Maps API no está disponible");
    return;
  }

  try {
    // Verificar que las paradas tengan coordenadas válidas
    const paradasValidas = paradas.every(parada => 
      parada.paradaLat && parada.paradaLng && 
      !isNaN(parseFloat(parada.paradaLat)) && 
      !isNaN(parseFloat(parada.paradaLng))
    );

    if (!paradasValidas) {
      console.error("Algunas paradas no tienen coordenadas válidas");
      return;
    }

    // Calcular la distancia total
    const distanciaCalculada = await calcularDistanciaTotal();
    
    if (distanciaCalculada <= 0) {
      console.error("Error: La distancia calculada es 0 o negativa");
      return;
    }

    // Calcular los costos
    const costos = await calcularCostoParada(
      paradas,
      parseFloat(rutaData.costoGasolina),
      distanciaCalculada,
      rutaData.puntoInicioLat,
      rutaData.puntoInicioLng,
      rutaData.puntoFinalLat,
      rutaData.puntoFinalLng,
      window.google,
      rutaData.tipoRuta
    );

    setCostosCalculados(costos);
    console.log("Distancia total:", distanciaCalculada);
    console.log("Costos calculados:", costos);

  } catch (error) {
    console.error("Error en el cálculo:", error);
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