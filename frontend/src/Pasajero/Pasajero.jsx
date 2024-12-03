import React, { useState, useEffect } from 'react';
import { Clock, Map, Search, Car, History } from 'lucide-react';
import RutaCard from './RutaCard';
import SeguimientoViaje from './Viaje/SeguimientoViaje';
import HistorialReservaciones from './HistorialReservaciones';
import Toast from './Toast';

const Pasajero = ({ userId }) => {
    const [selectedOption, setSelectedOption] = useState('reservar');
    const [rutas, setRutas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viajeActivo, setViajeActivo] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
    };

    const handleReservacion = async (ruta, parada) => {
        try {
            const response = await fetch('http://localhost:8080/api/reservaciones/crear', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pasajeroId: userId,
                    rutaId: ruta.rutaId,
                    paradaId: parada.paradaId,
                    tipoRuta: ruta.tipoRuta.toString()
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al crear la reservación');
            }

            showToast('Reservación creada exitosamente');
            await cargarDatos();
        } catch (error) {
            console.error('Error al reservar:', error);
            showToast(error.message, 'error');
        }
    };

    const cargarDatos = async () => {
        try {
            setIsLoading(true);
            const [rutasResponse, viajeActivoResponse] = await Promise.all([
                fetch('http://localhost:8080/api/reservaciones/proximos-7-dias', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }),
                fetch(`http://localhost:8080/api/reservaciones/viaje-activo/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                })
            ]);

            const rutasData = await rutasResponse.json();
            setRutas(rutasData);

            if (viajeActivoResponse.ok) {
                const viajeData = await viajeActivoResponse.json();
                if (viajeData) {
                    setViajeActivo(viajeData);
                    setSelectedOption('seguimiento');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error al cargar la información', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [userId]);


    const handleViajeUpdate = async (viajeActualizado) => {
        try {
            setViajeActivo(viajeActualizado);
            
            // Si el viaje se finalizó y calificó, esperar un momento y recargar
            if (viajeActualizado.estado === 'FINALIZADO' && viajeActualizado.calificado) {
                setTimeout(() => {
                    cargarDatos();
                    setSelectedOption('reservar'); // Volver a la vista de reservas
                }, 2000);
            }
        } catch (error) {
            console.error('Error al actualizar viaje:', error);
            showToast('Error al actualizar el estado del viaje', 'error');
        }
    };

    const renderContent = () => {
        switch (selectedOption) {
            case 'seguimiento':
                if (!viajeActivo) {
                    return (
                        <div className="text-center py-8">
                            <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">
                                No hay viaje activo
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No tienes ningún viaje en curso en este momento
                            </p>
                        </div>
                    );
                }
                return (
                    <SeguimientoViaje 
                        userId={userId} 
                        viaje={viajeActivo}
                        onViajeUpdate={handleViajeUpdate}
                    />
                );

            case 'historial':
                return <HistorialReservaciones userId={userId} />;

            default:
                return (
                    <>
                        <div className="mb-6">
                            <div className="relative max-w-xl">
                                <input
                                    type="text"
                                    placeholder="Buscar por ruta, destino o parada..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {rutas
                                .filter(ruta => 
                                    ruta.nombreRuta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    ruta.puntoInicioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    ruta.puntoFinalNombre.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((ruta) => (
                                    <RutaCard 
                                        key={ruta.rutaId} 
                                        ruta={ruta}
                                        onReservar={handleReservacion}
                                        disabled={viajeActivo !== null}
                                    />
                                ))
                            }
                        </div>
                    </>
                );
        }
    };

    

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                            Panel del Pasajero
                        </h2>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => setSelectedOption('seguimiento')}
                                className={`group relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                    selectedOption === 'seguimiento'
                                        ? 'bg-secundary text-white shadow-lg transform scale-105'
                                        : 'bg-white text-secundary border-2 border-secundary'
                                }`}
                            >
                                <span className="flex items-center justify-center translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-2 group-hover:skew-y-10">
                                    <Map className="h-5 w-5 mr-2" />
                                    Seguir Ruta
                                </span>
                            </button>
    
                            <button
                                onClick={() => setSelectedOption('reservar')}
                                className={`group relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                    selectedOption === 'reservar'
                                        ? 'bg-tertiary text-white shadow-lg transform scale-105'
                                        : 'bg-white text-tertiary border-2 border-tertiary'
                                }`}
                            >
                                <span className="flex items-center justify-center translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-2 group-hover:skew-y-10">
                                    <Car className="h-5 w-5 mr-2" />
                                    Reservar Viaje
                                </span>
                            </button>
    
                            <button
                                onClick={() => setSelectedOption('historial')}
                                className={`group relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                    selectedOption === 'historial'
                                        ? 'bg-secundary text-white shadow-lg transform scale-105'
                                        : 'bg-white text-secundary border-2 border-secundary'
                                }`}
                            >
                                <span className="flex items-center justify-center translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-2 group-hover:skew-y-10">
                                    <History className="h-5 w-5 mr-2" />
                                    Historial
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                            </div>
                        ) : (
                            renderContent()
                        )}
                    </div>
                </div>
            </div>

            {toast.show && (
                <Toast 
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: 'success' })}
                />
            )}
        </>
    );
};

export default Pasajero;