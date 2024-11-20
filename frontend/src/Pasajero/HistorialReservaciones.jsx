import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Star, User } from 'lucide-react';
import { formatearFechaLocal } from '../utils/dateUtils';

const HistorialReservaciones = ({ userId }) => {
    const [reservaciones, setReservaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:8080/api/reservaciones/historial/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (!response.ok) throw new Error('Error al cargar el historial');
                const data = await response.json();
                setReservaciones(data);
            } catch (error) {
                console.error('Error:', error);
                setError('Error al cargar el historial de reservaciones');
            } finally {
                setIsLoading(false);
            }
        };

        cargarHistorial();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (reservaciones.length === 0) {
        return (
            <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No hay reservaciones</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Aún no has realizado ninguna reservación.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reservaciones.map((reservacion) => (
                <div 
                    key={reservacion.reservacionId} 
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {reservacion.nombreRuta}
                            </h3>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatearFechaLocal(reservacion.fechaReservacion)}
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                            reservacion.estadoViaje === 'FINALIZADO' 
                                ? 'bg-green-100 text-green-800'
                                : reservacion.estadoViaje === 'EN_CURSO'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {reservacion.estadoViaje}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start space-x-2">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Parada</p>
                                <p className="font-medium">{reservacion.paradaNombre}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2">
                            <Star className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Costo</p>
                                <p className="font-medium">${reservacion.costoTotal}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Conductor</p>
                                <div className="flex items-center">
                                    <p className="font-medium mr-2">{reservacion.nombreConductor}</p>
                                    {reservacion.calificacionConductor > 0 && (
                                        <span className="flex items-center text-sm text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="ml-1">{reservacion.calificacionConductor.toFixed(1)}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistorialReservaciones;