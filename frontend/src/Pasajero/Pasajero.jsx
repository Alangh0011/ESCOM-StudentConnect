import React, { useState, useEffect } from 'react';
import { Clock, Map, Search, Car } from 'lucide-react';
import RutaCard from './RutaCard';
import Modal from './Modal';
import SeguimientoViaje from './Viaje/SeguimientoViaje';

const Alert = ({ message, type }) => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-100 text-green-800 border-green-400' :
        type === 'error' ? 'bg-red-100 text-red-800 border-red-400' :
        'bg-blue-100 text-blue-800 border-blue-400'
    } border`}>
        <p>{message}</p>
    </div>
);

const Pasajero = ({ userId }) => {
    const [selectedOption, setSelectedOption] = useState('reservar');
    const [rutas, setRutas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [viajeActivo, setViajeActivo] = useState(null);

    const showNotification = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
    };

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setIsLoading(true);
                const [rutasResponse, viajeActivoResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/reservaciones/proximos-7-dias', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Accept': 'application/json',
                        },
                    }),
                    fetch(`http://localhost:8080/api/reservaciones/viaje-activo/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Accept': 'application/json',
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
                showNotification('Error al cargar la información', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatos();
    }, [userId]);

    const handleOptionSelect = (option) => {
        if (viajeActivo && option === 'reservar') {
            showNotification('Ya tienes un viaje en curso', 'error');
            return;
        }
        setSelectedOption(option);
    };

    const handleReservacion = async (ruta, parada) => {
        try {
            const response = await fetch('http://localhost:8080/api/reservaciones/crear', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pasajeroId: userId,
                    rutaId: ruta.rutaId,
                    paradaId: parada.paradaId,
                    tipoRuta: ruta.tipoRuta
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al crear la reservación');
            }

            showNotification('Reservación creada exitosamente');
            setViajeActivo(data);
            setSelectedOption('seguimiento');

        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {showAlert && (
                <Alert message={alertMessage} type={alertType} />
            )}
            
            <div className="container mx-auto p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                        Panel del Pasajero
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => handleOptionSelect('seguimiento')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                selectedOption === 'seguimiento'
                                    ? 'bg-green-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
                            } ${viajeActivo ? 'animate-pulse' : ''}`}
                        >
                            <span className="flex items-center justify-center">
                                <Map className="h-5 w-5 mr-2" />
                                {viajeActivo ? 'Viaje en Curso' : 'Seguir Ruta'}
                            </span>
                        </button>

                        <button
                            onClick={() => handleOptionSelect('reservar')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                selectedOption === 'reservar'
                                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                            }`}
                            disabled={viajeActivo}
                        >
                            <span className="flex items-center justify-center">
                                <Car className="h-5 w-5 mr-2" />
                                Reservar Viaje
                            </span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
                    {selectedOption === 'seguimiento' && viajeActivo ? (
                        <SeguimientoViaje 
                            userId={userId}
                            viajeId={viajeActivo.viajeId}
                        />
                    ) : (
                        <>
                            <div className="mb-6">
                                <div className="relative max-w-xl">
                                    <input
                                        type="text"
                                        placeholder="Buscar por ruta, destino o parada..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {rutas.filter(ruta => 
                                        ruta.nombreRuta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        ruta.puntoInicioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        ruta.puntoFinalNombre.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((ruta) => (
                                        <RutaCard 
                                            key={ruta.rutaId} 
                                            ruta={ruta} 
                                            onReservar={handleReservacion}
                                            disabled={viajeActivo !== null}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pasajero;