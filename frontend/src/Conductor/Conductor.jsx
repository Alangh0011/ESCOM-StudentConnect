// Conductor.jsx
import React, { useState } from 'react';
import Ruta from './Ruta';

const Conductor = ({ userId }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Menú del Conductor</h2>
            <div className="flex space-x-4 mb-6">
                <button 
                    onClick={() => handleOptionSelect('registrarRuta')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
                >
                    Registrar Ruta
                </button>
                <button 
                    onClick={() => handleOptionSelect('verRutas')}
                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
                >
                    Ver mis Rutas
                </button>
                <button 
                    onClick={() => handleOptionSelect('verCalificaciones')}
                    className="bg-gradient-to-r from-yellow-400 to-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
                >
                    Ver Calificaciones
                </button>
                <button 
                    onClick={() => handleOptionSelect('contactoAsistencia')}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
                >
                    Contacto de Asistencia
                </button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow">
                {selectedOption === 'registrarRuta' && <Ruta userId={userId} />}
                {selectedOption === 'verRutas' && <p>Aquí se mostrarán las rutas guardadas (componente aún por crear)</p>}
                {selectedOption === 'verCalificaciones' && <p>Aquí se mostrarán las calificaciones o comentarios (componente aún por crear)</p>}
                {selectedOption === 'contactoAsistencia' && <p>Información de contacto para asistencia (componente aún por crear)</p>}
            </div>
        </div>
    );
};

export default Conductor;
