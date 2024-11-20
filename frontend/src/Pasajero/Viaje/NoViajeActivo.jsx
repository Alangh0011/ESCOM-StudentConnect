import React from 'react';
import { Map, AlertTriangle, Car } from 'lucide-react';

const NoViajeActivo = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-6">
                    <Car className="w-16 h-16 text-gray-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    No hay viaje activo
                </h3>
                
                <p className="text-gray-600 max-w-md mb-6">
                    No tienes ningún viaje en curso en este momento. 
                    Puedes reservar un nuevo viaje desde la sección "Reservar Viaje".
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-700">
                            Cuando reserves un viaje, podrás ver en tiempo real la ubicación 
                            del conductor y el progreso de la ruta en esta pantalla.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoViajeActivo;