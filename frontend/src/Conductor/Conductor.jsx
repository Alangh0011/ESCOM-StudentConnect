import React, { useState } from 'react';
import Ruta from './Ruta';
import VerRutas from './VerRutas';
import ViajeActivo from './Viaje/ViajeActivo';

const Alert = ({ message, type }) => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-100 text-green-800 border-green-400' :
        type === 'error' ? 'bg-red-100 text-red-800 border-red-400' :
        'bg-blue-100 text-blue-800 border-blue-400'
    } border`}>
        <p>{message}</p>
    </div>
);

const Conductor = ({ userId }) => {
    const [selectedOption, setSelectedOption] = useState('verRutas');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [viajeEnCurso, setViajeEnCurso] = useState(false);

    const showNotification = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
    };

    const handleOptionSelect = (option) => {
        if (viajeEnCurso && option !== 'viajeActivo') {
            showNotification('Tienes un viaje en curso. Finalízalo antes de cambiar de sección.', 'error');
            return;
        }
        setSelectedOption(option);
    };

    const handleViajeStart = () => {
        setViajeEnCurso(true);
        showNotification('Viaje iniciado correctamente', 'success');
    };

    const handleViajeEnd = () => {
        setViajeEnCurso(false);
        showNotification('Viaje finalizado correctamente', 'success');
    };

    const handleRutaSuccess = (message) => {
        showNotification(message, 'success');
        setSelectedOption('verRutas');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1">
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
                                onClick={() => handleOptionSelect('viajeActivo')}
                                className={`group relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                    selectedOption === 'viajeActivo'
                                        ? 'bg-secundary text-white shadow-lg transform scale-105'
                                        : 'bg-white text-secundary border-2 border-secundary'
                                } ${viajeEnCurso ? 'animate-pulse' : ''}`}
                            >
                                <span className="flex items-center justify-center translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-2 group-hover:skew-y-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    {viajeEnCurso ? 'Viaje en Curso' : 'Viaje Activo'}
                                </span>
                            </button>

                            <button
                                onClick={() => handleOptionSelect('registrarRuta')}
                                className={`group relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                    selectedOption === 'registrarRuta'
                                        ? 'bg-tertiary text-white shadow-lg transform scale-105'
                                        : 'bg-white text-tertiary border-2 border-tertiary'
                                }`}
                                disabled={viajeEnCurso}
                            >
                                <span className="flex items-center justify-center translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-2 group-hover:skew-y-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Registrar Nueva Ruta
                                </span>
                            </button>
                            
                            <button
                                onClick={() => handleOptionSelect('verRutas')}
                                className={`group relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                    selectedOption === 'verRutas'
                                        ? 'bg-secundary text-white shadow-lg transform scale-105'
                                        : 'bg-white text-secundary border-2 border-secundary'
                                }`}
                                disabled={viajeEnCurso}
                            >
                                <span className="flex items-center justify-center translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-2 group-hover:skew-y-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Mis Rutas
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
                        {selectedOption === 'viajeActivo' && (
                            <ViajeActivo 
                                userId={userId}
                                onViajeStart={handleViajeStart}
                                onViajeEnd={handleViajeEnd}
                                onSuccess={(message) => showNotification(message, 'success')}
                                onError={(message) => showNotification(message, 'error')}
                            />
                        )}
                        {selectedOption === 'registrarRuta' && (
                            <Ruta 
                                userId={userId} 
                                onSuccess={handleRutaSuccess}
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
        </div>
    );
};

export default Conductor;