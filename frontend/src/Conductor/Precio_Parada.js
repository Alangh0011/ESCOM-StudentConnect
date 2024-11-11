export const calcularCostoParada = async (paradas, costoGasolina, distanciaTotal, puntoInicioLat, puntoInicioLng, puntoFinalLat, puntoFinalLng, googleMaps, tipoRuta) => {
  const costosPorParada = [];

  for (let i = 0; i < paradas.length; i++) {
    let origen, destino;

    if (tipoRuta === "E") {
      // Escuela a Casa: desde inicio hasta la parada o entre paradas
      origen = i === 0 
        ? { paradaLat: puntoInicioLat, paradaLng: puntoInicioLng }
        : paradas[i - 1];
      destino = paradas[i];
    } else {
      // Casa a Escuela: entre paradas o desde parada hasta el destino final
      origen = paradas[i];
      destino = i === paradas.length - 1 
        ? { paradaLat: puntoFinalLat, paradaLng: puntoFinalLng }
        : paradas[i + 1];
    }

    if (!origen.paradaLat || !origen.paradaLng || !destino.paradaLat || !destino.paradaLng) {
      console.error("Coordenadas inválidas para origen o destino", { origen, destino });
      continue;
    }

    try {
      const distanciaParada = await calcularDistanciaEntrePuntos(origen, destino);
      const costoParada = ((distanciaParada * costoGasolina) / distanciaTotal).toFixed(2);

      costosPorParada.push({ ...paradas[i], costoParada, distanciaParada });
    } catch (error) {
      console.error("Error al calcular la distancia entre paradas:", error);
    }
  }

  return costosPorParada;
};


export const calcularDistanciaEntrePuntos = (googleMaps, origen, destino) => {
  const directionsService = new googleMaps.DirectionsService();

  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin: { lat: parseFloat(origen.paradaLat), lng: parseFloat(origen.paradaLng) },
        destination: { lat: parseFloat(destino.paradaLat), lng: parseFloat(destino.paradaLng) },
        travelMode: googleMaps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result.routes.length > 0) {
          const distancia = result.routes[0].legs[0].distance.value / 1000; // Convertir de metros a km
          resolve(distancia);
        } else {
          console.error("Error al calcular la distancia:", status, result);
          reject("Error al calcular la distancia: " + status);
        }
      }
    );
  });
};

