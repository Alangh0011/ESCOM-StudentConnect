import React from 'react';
import { MapPin, Users, Clock, Car } from 'lucide-react';

const RutaCard = ({ ruta, onReservar, disabled = false }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${disabled ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{ruta.nombreRuta}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {ruta.tipoRuta === 'E' ? 'Escuela → Casa' : 'Casa → Escuela'}
                </span>
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
                            {new Date(ruta.fechaProgramada).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-700">
                        {ruta.numeroPasajeros || 0}/{ruta.numeroParadas || 0} pasajeros
                    </p>
                </div>
            </div>

            {ruta.paradas && ruta.paradas.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Paradas disponibles:</h4>
                    <div className="grid gap-2">
                        {ruta.paradas.filter(p => !p.ocupado).map((parada) => (
                            <button
                                key={parada.paradaId}
                                onClick={() => !disabled && onReservar(ruta, parada)}
                                disabled={disabled || parada.ocupado}
                                className={`w-full px-4 py-2 text-left rounded-lg border
                                    ${disabled || parada.ocupado 
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                        : 'hover:bg-blue-50 hover:border-blue-300 border-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{parada.paradaNombre}</span>
                                    <span className="text-sm text-gray-500">
                                        ${parada.costoParada}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {disabled && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700 flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        No puedes reservar mientras tengas un viaje activo
                    </p>
                </div>
            )}
        </div>
    );
};

export default RutaCard;