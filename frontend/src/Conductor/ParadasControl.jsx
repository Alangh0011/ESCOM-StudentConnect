// ParadasControl.jsx
import React, { useState, useContext, useEffect } from 'react'; // Añadido useEffect
import GoogleMapsContext from '../GoogleMapsContext';
import Paradas from './Paradas';
import { calcularCostoParada, calcularDistanciaEntrePuntos } from './Precio_Parada';
import { actualizarDistanciaTotal } from './rutaAPI';
import { validarNombreParada } from '../utils/validaciones';
import { useHistory } from 'react-router-dom';
import axios from 'axios';


const ParadasControl = ({ rutaData }) => {
  useEffect(() => {
    // Validar que tengamos todos los datos necesarios
    console.log("Datos de ruta recibidos en ParadasControl:", rutaData);
    if (!rutaData.puntoInicioLat || !rutaData.puntoInicioLng || 
        !rutaData.puntoFinalLat || !rutaData.puntoFinalLng) {
        console.error("Faltan coordenadas necesarias:", rutaData);
    }
}, [rutaData]);


  const { isLoaded, loadError, googleMaps } = useContext(GoogleMapsContext);
  const history = useHistory();
  const [paradas, setParadas] = useState(
    Array.from({ length: rutaData.numeroParadas }, () => ({
      paradaNombre: '',
      paradaLat: null,
      paradaLng: null,
      costoParada: null,
      distanciaParada: null,
    }))
  );
  const [distanciaTotal, setDistanciaTotal] = useState(0);
  const [costosCalculados, setCostosCalculados] = useState([]);
  const [sumaTotal, setSumaTotal] = useState(0);

  const actualizarParada = (index, nuevaParada) => {
    const nuevasParadas = [...paradas];
    nuevasParadas[index] = {
      ...nuevasParadas[index],
      ...nuevaParada,
    };
    setParadas(nuevasParadas);
  };

  useEffect(() => {
    if (costosCalculados.length > 0) {
      // Actualizar las paradas con los nuevos datos calculados
      const paradasActualizadas = paradas.map((parada, index) => ({
        ...parada,
        ...costosCalculados[index] // Esto incluirá tanto distanciaParada como costoParada
      }));
      
      setParadas(paradasActualizadas);
  
      // Calcular la suma total de los costos
      const total = costosCalculados.reduce(
        (sum, parada) => sum + (parada.costoParada || 0),
        0
      );
      
      setSumaTotal(total);
      
      console.log('Paradas actualizadas:', paradasActualizadas);
    }
  }, [costosCalculados]);

  const calcularDistanciaTotal = async () => {
    if (!isLoaded) {
      console.error("Google Maps no está disponible.");
      return;
    }
  
    let distanciaAcumulada = 0;
    const directionsService = new window.google.maps.DirectionsService();
    const paradasActualizadas = [...paradas];
    
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
  
        const distanciaInicial = resultadoInicial.routes[0].legs[0].distance.value / 1000;
      distanciaAcumulada += distanciaInicial;
      paradasActualizadas[0] = {
        ...paradasActualizadas[0],
        distanciaParada: distanciaInicial
      };
      console.log("Distancia a primera parada:", distanciaInicial);
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
  
          const distanciaEntreParadas = resultadoEntreParadas.routes[0].legs[0].distance.value / 1000;
        distanciaAcumulada += distanciaEntreParadas;
        paradasActualizadas[i + 1] = {
          ...paradasActualizadas[i + 1],
          distanciaParada: distanciaEntreParadas
        };
        console.log(`Distancia entre paradas ${i} y ${i + 1}:`, distanciaEntreParadas);
      
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
      setParadas(paradasActualizadas);
      setDistanciaTotal(distanciaAcumulada);
      await actualizarDistanciaTotal(rutaData.rutaId, distanciaAcumulada);
    console.log("Distancia total calculada y actualizada:", distanciaAcumulada);
    console.log("Paradas actualizadas con distancias:", paradasActualizadas);
    
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
  // Validar que tengamos todas las coordenadas necesarias
  const coordenadasCompletas = rutaData.puntoInicioLat && 
  rutaData.puntoInicioLng && 
  rutaData.puntoFinalLat && 
  rutaData.puntoFinalLng;

    if (!coordenadasCompletas) {
    console.error("Faltan coordenadas para calcular la ruta", rutaData);
    alert("No se pueden realizar los cálculos: faltan coordenadas de la ruta");
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
    
    if (!distanciaCalculada || distanciaCalculada <= 0) {
      console.error("Error: Distancia inválida");
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
    if (costos && costos.length > 0) {
      setCostosCalculados(costos);
    }

    setCostosCalculados(costos);
    console.log("Distancia total:", distanciaCalculada);
    console.log("Costos calculados:", costos);

  } catch (error) {
    console.error("Error en el cálculo:", error);
  }
};

  if (loadError) return <p>Error al cargar Google Maps: {loadError.message}</p>;

  const guardarParadas = async () => {
    try {
        const todasParadasValidas = paradas.every(parada => 
            validarNombreParada(parada.paradaNombre)
        );

        if (!todasParadasValidas) {
            console.error("Todas las paradas deben ser estaciones de transporte válidas");
            return;
        }

        const paradasParaEnviar = paradas.map(parada => ({
            paradaNombre: parada.paradaNombre,
            paradaLat: parada.paradaLat,
            paradaLng: parada.paradaLng,
            costoParada: parada.costoParada,
            distanciaParada: parseFloat(parada.distanciaParada) || 0,
            tiempo: "30 min"
        }));

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No hay token de autenticación");
            return;
        }

        const response = await fetch(`http://localhost:8080/api/rutas/${rutaData.rutaId}/paradas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(paradasParaEnviar)
        });

        if (!response.ok) {
            throw new Error('Error al guardar las paradas');
        }

        const data = await response.json();
        console.log('Paradas guardadas exitosamente:', data);
        alert("¡Todas las paradas han sido registradas exitosamente!");
        // Redirigir a la vista de rutas
      history.push('/home');
    } catch (error) {
        console.error('Error al guardar las paradas:', error);
    }
};


  return (
    <div>
      {paradas.map((parada, index) => (
        <Paradas 
          key={index} 
          index={index} 
          parada={parada}
          actualizarParada={actualizarParada}
        />
      ))}
      {/* Contenedor para los botones */}
<div className="flex flex-col space-y-4 mt-6">
  {/* Botón de Calcular */}
  <button
    onClick={handleCalcularDistanciaYCostos}
    className={`
      flex items-center justify-center
      bg-blue-500 hover:bg-blue-600 
      text-white font-semibold 
      px-6 py-3 rounded-lg
      transition-all duration-200
      transform hover:scale-105
      shadow-md hover:shadow-lg
      ${!paradas.every(p => p.paradaLat && p.paradaLng) ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    disabled={!paradas.every(p => p.paradaLat && p.paradaLng)}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 mr-2" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
      />
    </svg>
    Calcular Distancia y Costos
  </button>

  {/* Botón de Confirmar y Enviar */}
  <button
    onClick={guardarParadas}
    disabled={!distanciaTotal || costosCalculados.length === 0}
    className={`
      flex items-center justify-center
      px-6 py-3 rounded-lg
      font-semibold
      transform transition-all duration-200
      shadow-md
      ${distanciaTotal && costosCalculados.length > 0
        ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 hover:shadow-lg'
        : 'bg-gray-300 cursor-not-allowed text-gray-500'
      }
    `}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 mr-2" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M5 13l4 4L19 7" 
      />
    </svg>
    {distanciaTotal && costosCalculados.length > 0 ? 'Confirmar y Enviar' : 'Complete los cálculos primero'}
  </button>

  {/* Resumen de costos con estilo mejorado */}
  {distanciaTotal > 0 && (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        Resumen de Costos y Distancia
      </h3>
      <div className="space-y-2">
        <p className="flex justify-between items-center text-gray-600">
          <span>Distancia Total:</span>
          <span className="font-medium">{distanciaTotal.toFixed(2)} km</span>
        </p>
        {paradas.map((parada, index) => (
          <p key={index} className="flex justify-between items-center text-gray-600">
            <span>Parada {index + 1}:</span>
            <span className="font-medium">${parseFloat(parada.costoParada || 0).toFixed(2)}</span>
          </p>
        ))}
        <div className="border-t border-gray-200 mt-2 pt-2">
          <p className="flex justify-between items-center text-lg font-bold text-gray-800">
            <span>Costo Total:</span>
            <span>${sumaTotal.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  )}
</div>
    </div>
  );
};

export default ParadasControl;