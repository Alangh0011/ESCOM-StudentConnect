import React from 'react';
import { Users, MapPin } from 'lucide-react';

const ListaViajes = ({ viajesHoy, viajeSeleccionado, setViajeSeleccionado, tipoRuta }) => {
    const getEstadoClass = (estado) => {
        switch (estado) {
            case 'EN_CURSO':
                return 'bg-blue-100 text-blue-600';
            case 'FINALIZADO':
                return 'bg-gray-100 text-gray-600';
            case 'PENDIENTE':
                return 'bg-yellow-100 text-yellow-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    if (!viajesHoy || viajesHoy.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No hay viajes programados para hoy</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {viajesHoy.map((viaje) => {
                // Calcular el número de pasajeros y paradas
                const numeroPasajeros = viaje.pasajeros?.length || 0;
                const numeroParadas = viaje.numeroParadas || 0;

                return (
                    <div 
                        key={`${viaje.rutaId}-${viaje.fechaProgramada}`}
                        className={`p-4 rounded-lg border transition-all ${
                            viajeSeleccionado?.rutaId === viaje.rutaId 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-300'
                        } ${viaje.estado === 'FINALIZADO' 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer'
                        }`}
                        onClick={() => {
                            if (viaje.estado !== 'FINALIZADO') {
                                console.log("Seleccionando viaje:", viaje);
                                setViajeSeleccionado(viaje);
                            }
                        }}
                    >
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium text-lg">{viaje.nombreRuta}</h4>
                            <span className={`text-sm px-2 py-1 rounded ${getEstadoClass(viaje.estado)}`}>
                                {viaje.estado || 'PENDIENTE'}
                            </span>
                        </div>
                        
                        <div className="mt-2 space-y-2">
                            <p className="text-sm text-gray-600">
                                Fecha: {new Date(viaje.fechaProgramada).toLocaleString()}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center text-blue-600">
                                    <Users size={16} className="mr-1" />
                                    <span>
                                        {numeroPasajeros}/{numeroParadas} pasajeros
                                    </span>
                                </div>
                                <div className="flex items-center text-purple-600">
                                    <MapPin size={16} className="mr-1" />
                                    <span>{numeroParadas} paradas</span>
                                </div>
                            </div>

                            {viaje.pasajeros && viaje.pasajeros.length > 0 && (
                                <div className="mt-2 text-xs text-gray-600">
                                    <p>Pasajeros:</p>
                                    <ul className="ml-4">
                                        {viaje.pasajeros.map(pasajero => (
                                            <li key={pasajero.id}>
                                                • {pasajero.nombre} {pasajero.apellidoPaterno}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {viaje.estado === 'FINALIZADO' && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Este viaje ya ha sido finalizado
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ListaViajes;