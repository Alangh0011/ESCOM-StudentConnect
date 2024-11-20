import React, { useState } from 'react';
import { MapPin, Users, Clock, Car, AlertCircle } from 'lucide-react';
import { formatearFechaLocal } from '../utils/dateUtils';

const RutaCard = ({ ruta, onReservar, disabled = false }) => {
    const [mostrarTodasParadas, setMostrarTodasParadas] = useState(false);
    const paradasDisponibles = ruta.paradas?.filter(p => !p.ocupado).length || 0;
    const totalParadas = ruta.paradas?.length || 0;
    const fechaFormateada = formatearFechaLocal(ruta.fechaProgramada);

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${disabled ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{ruta.nombreRuta}</h3>
                <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {ruta.tipoRuta === 'E' ? 'Escuela → Casa' : 'Casa → Escuela'}
                    </span>
                    <span className="text-sm text-gray-600">
                        {paradasDisponibles} de {totalParadas} paradas disponibles
                    </span>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                        <p className="text-sm text-gray-500">Origen</p>
                        <p className="text-gray-700">{ruta.puntoInicioNombre}</p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                        <p className="text-sm text-gray-500">Destino</p>
                        <p className="text-gray-700">{ruta.puntoFinalNombre}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                        <p className="text-gray-700">
                            {fechaFormateada} {ruta.horario}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-700">
                        {ruta.numeroPasajeros}/{ruta.numeroParadas} pasajeros
                    </p>
                </div>
            </div>

            {ruta.paradas && ruta.paradas.length > 0 && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Paradas:</h4>
                        <button
                            onClick={() => setMostrarTodasParadas(!mostrarTodasParadas)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            {mostrarTodasParadas ? 'Mostrar disponibles' : 'Mostrar todas'}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {ruta.paradas
                            .filter(p => mostrarTodasParadas ? true : !p.ocupado)
                            .map((parada) => (
                                <div
                                    key={parada.paradaId}
                                    className={`p-3 rounded-lg border ${
                                        parada.ocupado 
                                            ? 'bg-gray-50 border-gray-200'
                                            : 'border-blue-100 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-2 h-2 rounded-full ${
                                                parada.ocupado ? 'bg-red-500' : 'bg-green-500'
                                            }`} />
                                            <span className="text-sm">
                                                {parada.paradaNombre}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm text-gray-500">
                                                ${parada.costoParada}
                                            </span>
                                            {!parada.ocupado && !disabled && (
                                                <button
                                                    onClick={() => onReservar(ruta, parada)}
                                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                                >
                                                    Reservar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {disabled && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        No puedes reservar mientras tengas un viaje activo
                    </p>
                </div>
            )}
        </div>
    );
};

export default RutaCard;