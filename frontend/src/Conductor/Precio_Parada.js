// Precio_Parada.js
export const calcularCostoParada = (distanciaParada, distanciaTotal, costoGasolina) => {
    return ((distanciaParada * costoGasolina) / distanciaTotal).toFixed(2);
  };
  