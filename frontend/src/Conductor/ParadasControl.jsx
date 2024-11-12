// ParadasControl.jsx
import React, { useState, useContext, useEffect } from 'react'; // Añadido useEffect
import GoogleMapsContext from '../GoogleMapsContext';
import Paradas from './Paradas';
import { calcularCostoParada, calcularDistanciaEntrePuntos } from './Precio_Parada';
import { actualizarDistanciaTotal } from './rutaAPI';
import { validarNombreParada } from '../utils/validaciones';
import { useNavigate } from 'react-router-dom';


const ParadasControl = ({ rutaData }) => {
  const { isLoaded, loadError, googleMaps } = useContext(GoogleMapsContext);
  const navigate = useNavigate();
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
        // Validar que todas las paradas sean válidas
        const todasParadasValidas = paradas.every(parada => 
            validarNombreParada(parada.paradaNombre)
        );

        if (!todasParadasValidas) {
            console.error("Todas las paradas deben ser estaciones de transporte válidas");
            return;
        }

        // Preparar los datos para enviar al backend
        const paradasParaEnviar = paradas.map(parada => ({
            paradaNombre: parada.paradaNombre,
            paradaLat: parada.paradaLat,
            paradaLng: parada.paradaLng,
            costoParada: parada.costoParada,
            distanciaParada: parseFloat(parada.distanciaParada) || 0, // Convertir a float, usar 0 si es null
            tiempo: "30 min"
        }));

        console.log("Datos de paradas a enviar:", paradasParaEnviar);

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
        console.log('Paradas enviadas:', JSON.stringify(paradasParaEnviar));
        if (!response.ok) {
            throw new Error('Error al guardar las paradas');
        }

        const data = await response.json();
        console.log('Paradas guardadas exitosamente:', data);
        // Redirigir a "Ver Rutas" después de guardar exitosamente
        navigate('/verRutas');
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
      <button
        onClick={handleCalcularDistanciaYCostos}
        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded mt-4"
      >
        Calcular Distancia y Costos
      </button>
      <div className="mt-4">
        <h3 className="font-bold">Resumen de Costos y Distancia:</h3>
        <p>Distancia Total: {distanciaTotal.toFixed(2)} km</p>
        {paradas.map((parada, index) => (
          <p key={index}>
            Costo de Parada {index + 1}: ${parseFloat(parada.costoParada || 0).toFixed(2)}
          </p>
        ))}
        <p className="font-bold mt-2 text-lg">
          Costo Total: ${sumaTotal.toFixed(2)}
        </p>
      </div>
      <button
        className="bg-green-500 text-white font-semibold px-4 py-2 rounded mt-4"
        disabled={!distanciaTotal || costosCalculados.length === 0}
        onClick={guardarParadas}
      >
        Confirmar y Enviar
      </button>
    </div>
  );
};

export default ParadasControl;