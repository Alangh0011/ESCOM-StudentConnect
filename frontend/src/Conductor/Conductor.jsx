import React, { useState, useEffect } from 'react';
import Ruta from './Ruta';
import VerRutas from './VerRutas';

const Conductor = ({ userId }) => {
    const [selectedOption, setSelectedOption] = useState('verRutas'); // Cambiado para mostrar las rutas por defecto
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' o 'error'

    // Función para mostrar alertas
    const showNotification = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000); // La alerta desaparece después de 5 segundos
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    // Componente de Alerta
    const Alert = ({ message, type }) => (
        <div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-500 ${
                type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
            style={{ zIndex: 1000 }}
        >
            {message}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {showAlert && (
                <Alert message={alertMessage} type={alertType} />
            )}
            
            <div className="container mx-auto p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                        Panel de Control del Conductor
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => handleOptionSelect('registrarRuta')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                selectedOption === 'registrarRuta'
                                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            <span className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Registrar Nueva Ruta
                            </span>
                        </button>
                        
                        <button
                            onClick={() => handleOptionSelect('verRutas')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                selectedOption === 'verRutas'
                                    ? 'bg-green-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
                            }`}
                        >
                            <span className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Mis Rutas
                            </span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
                    {selectedOption === 'registrarRuta' && (
                        <Ruta 
                            userId={userId} 
                            onSuccess={(message) => showNotification(message, 'success')}
                            onError={(message) => showNotification(message, 'error')}
                        />
                    )}
                    {selectedOption === 'verRutas' && (
                        <VerRutas 
                            userId={userId}
                            onSuccess={(message) => showNotification(message, 'success')}
                            onError={(message) => showNotification(message, 'error')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Conductor;