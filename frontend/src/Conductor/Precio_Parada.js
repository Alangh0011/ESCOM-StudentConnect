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
  try {
    const paradasConDistancias = [];
    const costoGasolinaTotal = parseFloat(costoGasolina);

    // Calcular las distancias y costos base
    if (tipoRuta === "E") {
      // Primera parada: desde inicio
      let primeraDistancia = await calcularDistanciaEntrePuntos(
        googleMaps,
        { paradaLat: puntoInicioLat, paradaLng: puntoInicioLng },
        paradas[0]
      );
      
      paradasConDistancias.push({
        ...paradas[0],
        distanciaParada: primeraDistancia,
        costoParada: parseFloat(((primeraDistancia * costoGasolinaTotal) / distanciaTotal).toFixed(2))
      });

      // Resto de paradas
      for (let i = 1; i < paradas.length; i++) {
        let distancia = await calcularDistanciaEntrePuntos(
          googleMaps,
          paradas[i-1],
          paradas[i]
        );
        
        paradasConDistancias.push({
          ...paradas[i],
          distanciaParada: distancia,
          costoParada: parseFloat(((distancia * costoGasolinaTotal) / distanciaTotal).toFixed(2))
        });
      }
    } else {
      // Para ruta Casa a Escuela
      for (let i = 0; i < paradas.length - 1; i++) {
        let distancia = await calcularDistanciaEntrePuntos(
          googleMaps,
          paradas[i],
          paradas[i + 1]
        );
        
        paradasConDistancias.push({
          ...paradas[i],
          distanciaParada: distancia,
          costoParada: parseFloat(((distancia * costoGasolinaTotal) / distanciaTotal).toFixed(2))
        });
      }

      // Última parada hasta destino
      let ultimaDistancia = await calcularDistanciaEntrePuntos(
        googleMaps,
        paradas[paradas.length - 1],
        { paradaLat: puntoFinalLat, paradaLng: puntoFinalLng }
      );
      
      paradasConDistancias.push({
        ...paradas[paradas.length - 1],
        distanciaParada: ultimaDistancia,
        costoParada: parseFloat(((ultimaDistancia * costoGasolinaTotal) / distanciaTotal).toFixed(2))
      });
    }

    // Calcular la suma actual de costos
    const sumaCostosActual = paradasConDistancias.reduce(
      (sum, parada) => sum + parada.costoParada, 
      0
    );

    // Si hay más de una parada, distribuir la diferencia
    if (paradas.length > 1) {
      const diferencia = costoGasolinaTotal - sumaCostosActual;
      const distribucionPorParada = parseFloat((diferencia / paradas.length).toFixed(2));
      
      // Distribuir la diferencia equitativamente
      paradasConDistancias.forEach((parada, index) => {
        if (index === paradasConDistancias.length - 1) {
          // Para la última parada, ajustar cualquier diferencia por redondeo
          const sumaActual = paradasConDistancias.reduce(
            (sum, p, i) => i === index ? sum : sum + p.costoParada,
            0
          );
          parada.costoParada = parseFloat((costoGasolinaTotal - sumaActual).toFixed(2));
        } else {
          parada.costoParada = parseFloat((parada.costoParada + distribucionPorParada).toFixed(2));
        }
      });
    }

    // Verificación final
    console.log('Verificación de cálculos:', {
      costoGasolina: costoGasolinaTotal,
      sumaCostos: paradasConDistancias.reduce((sum, p) => sum + p.costoParada, 0),
      numeroParadas: paradas.length,
      desglose: paradasConDistancias.map(p => ({
        nombre: p.paradaNombre,
        distancia: p.distanciaParada.toFixed(2),
        costo: p.costoParada.toFixed(2)
      }))
    });

    return paradasConDistancias;
  } catch (error) {
    console.error('Error en cálculo de costos:', error);
    throw error;
  }
};