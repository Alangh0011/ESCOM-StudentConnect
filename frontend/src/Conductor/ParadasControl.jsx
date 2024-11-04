// ParadasControl.jsx
import React, { useState, useEffect } from 'react';
import Paradas from './Paradas';
import { calcularCostoParada } from './Precio_Parada';

const ParadasControl = ({ rutaData }) => {
  const [paradas, setParadas] = useState(
    Array.from({ length: rutaData.numeroParadas }, () => ({
      paradaNombre: '',
      distanciaParada: '',
      costoParada: '',
    }))
  );

  const actualizarParada = (index, nuevaParada) => {
    const nuevasParadas = [...paradas];
    nuevasParadas[index] = nuevaParada;
    setParadas(nuevasParadas);
  };

  const calcularCostos = () => {
    const costosCalculados = paradas.map((parada) => {
      return {
        ...parada,
        costoParada: calcularCostoParada(
          parseFloat(parada.distanciaParada),
          parseFloat(rutaData.distancia),
          parseFloat(rutaData.costoGasolina)
        ),
      };
    });
    setParadas(costosCalculados);
  };

  useEffect(() => {
    calcularCostos();
  }, [paradas]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Registrar Paradas</h2>
      {paradas.map((parada, index) => (
        <Paradas key={index} index={index} parada={parada} actualizarParada={actualizarParada} />
      ))}
      <button
        onClick={() => calcularCostos()}
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
