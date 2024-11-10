const calcularCostoParada = async (paradas, costoGasolina, distanciaTotal, puntoFinalLat, puntoFinalLng, googleMaps) => {
  if (!googleMaps) {
    console.error("Google Maps no está disponible.");
    return [];
  }

  const directionsService = new googleMaps.DirectionsService();
  const costosPorParada = [];

  for (let i = 0; i < paradas.length; i++) {
    const origen = paradas[i];
    const destino = i === paradas.length - 1
      ? { paradaLat: puntoFinalLat, paradaLng: puntoFinalLng } // Última parada al destino final
      : paradas[i + 1];

    if (!origen.paradaLat || !origen.paradaLng || !destino.paradaLat || !destino.paradaLng) {
      console.error("Coordenadas inválidas para origen o destino", { origen, destino });
      continue;
    }

    try {
      console.log("Calculando distancia entre:", origen, "y", destino);
      const distance = await calcularDistanciaEntrePuntos(directionsService, origen, destino, googleMaps);
      
      // Asegurarse de que todas las variables sean numéricas
      const distanciaUsada = parseFloat(distance) > parseFloat(distanciaTotal) ? parseFloat(distanciaTotal) : parseFloat(distance);
      const costoGasolinaNum = parseFloat(costoGasolina);
      const distanciaTotalNum = parseFloat(distanciaTotal);

      if (isNaN(distanciaUsada) || isNaN(costoGasolinaNum) || isNaN(distanciaTotalNum)) {
        console.error("Error: alguna de las variables para el cálculo es NaN", { distanciaUsada, costoGasolinaNum, distanciaTotalNum });
        continue;
      }

      // Calcular el costo de la parada
      const costo = ((distanciaUsada * costoGasolinaNum) / distanciaTotalNum).toFixed(2);
      console.log("Costo calculado para la parada:", costo);

      costosPorParada.push({ ...origen, costoParada: costo, distanciaParada: distance });
    } catch (error) {
      console.error("Error al calcular la distancia entre paradas:", error);
    }
  }

  return costosPorParada;
};



const calcularDistanciaEntrePuntos = (directionsService, origen, destino, googleMaps) => {
  return new Promise((resolve, reject) => {
    // Verifica que las coordenadas sean correctas antes de hacer la llamada a DirectionsService
    console.log("Origen:", origen);
    console.log("Destino:", destino);

    directionsService.route(
      {
        origin: { lat: origen.paradaLat, lng: origen.paradaLng },
        destination: { lat: destino.paradaLat, lng: destino.paradaLng },
        travelMode: googleMaps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result.routes.length > 0) {
          const distancia = result.routes[0].legs[0].distance.value / 1000; // Convertir de metros a km
          console.log("Distancia calculada:", distancia);
          resolve(distancia);
        } else {
          console.error("Error al calcular la distancia:", status, result);
          reject("Error al calcular la distancia: " + status);
        }
      }
    );
  });
};
