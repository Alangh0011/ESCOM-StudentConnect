// Precio_Parada.js
export const calcularDistanciaEntrePuntos = (googleMaps, origen, destino) => {
  return new Promise((resolve, reject) => {
    try {
      // Crear una nueva instancia del servicio de direcciones
      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: { lat: parseFloat(origen.paradaLat), lng: parseFloat(origen.paradaLng) },
        destination: { lat: parseFloat(destino.paradaLat), lng: parseFloat(destino.paradaLng) },
        travelMode: window.google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, (result, status) => {
        if (status === "OK" && result.routes.length > 0) {
          const distancia = result.routes[0].legs[0].distance.value / 1000; // Convertir de metros a km
          resolve(distancia);
        } else {
          reject(`Error al calcular la distancia: ${status}`);
        }
      });
    } catch (error) {
      reject(`Error en el cálculo de distancia: ${error.message}`);
    }
  });
};

// Precio_Parada.js
export const calcularCostoParada = async (
  paradas,
  costoGasolina,
  distanciaTotal,
  puntoInicioLat,
  puntoInicioLng,
  puntoFinalLat,
  puntoFinalLng,
  googleMaps,
  tipoRuta
) => {
  const costosPorParada = [];
  let distanciasParadas = [];
  
  try {
    // Primero calculamos todas las distancias
    if (paradas.length === 1) {
      const distancia = tipoRuta === "E" 
        ? await calcularDistanciaEntrePuntos(googleMaps, 
            { paradaLat: puntoInicioLat, paradaLng: puntoInicioLng },
            paradas[0])
        : await calcularDistanciaEntrePuntos(googleMaps,
            paradas[0],
            { paradaLat: puntoFinalLat, paradaLng: puntoFinalLng });
      
      distanciasParadas.push(distancia);
    } else {
      // Caso de múltiples paradas
      for (let i = 0; i < paradas.length; i++) {
        let distancia;
        
        if (tipoRuta === "E") {
          if (i === 0) {
            // Primera parada: desde inicio
            distancia = await calcularDistanciaEntrePuntos(googleMaps,
              { paradaLat: puntoInicioLat, paradaLng: puntoInicioLng },
              paradas[i]);
          } else {
            // Entre paradas
            distancia = await calcularDistanciaEntrePuntos(googleMaps,
              paradas[i-1],
              paradas[i]);
          }
        } else {
          if (i === paradas.length - 1) {
            // Última parada: hasta el final
            distancia = await calcularDistanciaEntrePuntos(googleMaps,
              paradas[i],
              { paradaLat: puntoFinalLat, paradaLng: puntoFinalLng });
          } else {
            // Entre paradas
            distancia = await calcularDistanciaEntrePuntos(googleMaps,
              paradas[i],
              paradas[i+1]);
          }
        }
        
        distanciasParadas.push(distancia);
      }
    }
    
    // Calculamos el costo base por cada parada según la distancia
    const totalCostoGasolina = parseFloat(costoGasolina);
    const costoPorKm = (totalCostoGasolina * 0.7) / distanciaTotal; // Usamos solo el 70% del costo total para la distribución por distancia
    
    // Calculamos los costos base por distancia
    distanciasParadas.forEach((distancia, index) => {
      const costoBase = (distancia * costoPorKm).toFixed(2);
      costosPorParada.push({
        ...paradas[index],
        costoParada: parseFloat(costoBase),
        distanciaParada: distancia
      });
    });
    
    // Calculamos el costo base total
    const costoBaseTotal = costosPorParada.reduce((sum, parada) => sum + parada.costoParada, 0);
    
    // Calculamos el costo restante a distribuir equitativamente
    const costoRestante = totalCostoGasolina - costoBaseTotal;
    const costoAdicionalPorParada = costoRestante / paradas.length;
    
    // Distribuimos el costo restante equitativamente
    costosPorParada.forEach(parada => {
      parada.costoParada = parseFloat((parada.costoParada + costoAdicionalPorParada).toFixed(2));
    });
    
    // Verificación final y ajuste de centavos si es necesario
    const sumaFinal = costosPorParada.reduce((sum, parada) => sum + parada.costoParada, 0);
    if (Math.abs(sumaFinal - totalCostoGasolina) > 0.01) {
      const diferencia = totalCostoGasolina - sumaFinal;
      costosPorParada[costosPorParada.length - 1].costoParada += parseFloat(diferencia.toFixed(2));
    }

    // Log de verificación
    console.log('Desglose de costos:');
    costosPorParada.forEach((parada, index) => {
      console.log(`Parada ${index + 1}:`, {
        distancia: parada.distanciaParada.toFixed(2) + ' km',
        costo: '$' + parada.costoParada.toFixed(2)
      });
    });
    console.log('Total costo gasolina:', totalCostoGasolina);
    console.log('Suma total de costos:', costosPorParada.reduce((sum, p) => sum + p.costoParada, 0).toFixed(2));

    return costosPorParada;
  } catch (error) {
    console.error("Error en cálculo de costos:", error);
    throw error;
  }
};