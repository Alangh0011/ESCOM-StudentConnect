// Conductor.jsx
import React, { useState } from 'react';
import Ruta from './Ruta';
import VerRutas from './VerRutas';

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
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow">
                {selectedOption === 'registrarRuta' && <Ruta userId={userId} />}
                {selectedOption === 'verRutas' && <VerRutas userId={userId} />}
            </div>
        </div>
    );
};

export default Conductor;
