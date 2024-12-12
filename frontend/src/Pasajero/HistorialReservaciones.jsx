import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Star, User } from 'lucide-react';
import { obtenerHistorialPasajero } from '../utils/rutaAPI';

const HistorialReservaciones = ({ userId }) => {
    const [reservaciones, setReservaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                setIsLoading(true);
                setError(null);
                console.log('Cargando historial para usuario:', userId);
                
                const data = await obtenerHistorialPasajero(userId);
                console.log('Datos recibidos:', data);
                setReservaciones(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error al cargar historial:', error);
                setError('Error al cargar el historial de reservaciones');
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            cargarHistorial();
        }
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
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    if (!reservaciones || reservaciones.length === 0) {
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

    const formatearFecha = (fecha) => {
        if (!fecha) return 'Fecha no disponible';
        try {
            return new Date(fecha).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    return (
        <div className="space-y-6">
            {reservaciones.map((reservacion) => (
                <div 
                    key={reservacion.reservacionId || Math.random()} 
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {reservacion.nombreRuta || 'Ruta sin nombre'}
                            </h3>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatearFecha(reservacion.fechaReservacion)}
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                            reservacion.estadoViaje === 'FINALIZADO' 
                                ? 'bg-green-100 text-green-800'
                                : reservacion.estadoViaje === 'EN_CURSO'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {reservacion.estadoViaje || 'PENDIENTE'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start space-x-2">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Parada</p>
                                <p className="font-medium">{reservacion.paradaNombre || 'No especificada'}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2">
                            <Star className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Costo</p>
                                <p className="font-medium">${reservacion.costoTotal?.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>
                    </div>

                    {reservacion.nombreConductor && (
                        <div className="border-t mt-4 pt-4">
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Conductor</p>
                                    <div className="flex items-center">
                                        <p className="font-medium mr-2">{reservacion.nombreConductor}</p>
                                        {reservacion.calificacionConductor > 0 && (
                                            <div className="flex items-center text-yellow-500">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span className="ml-1">
                                                    {Number(reservacion.calificacionConductor).toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default HistorialReservaciones;