import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';

const Modal = ({ isOpen, onClose, success, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className={`text-lg font-bold mb-2 ${success ? 'text-green-600' : 'text-red-600'}`}>
          {success ? 'Éxito' : 'Error'}
        </div>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

const Pasajero = ({ userId }) => {
    const [rutas, setRutas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, success: false, message: '' });

    useEffect(() => {
        fetchRutas();
    }, []);

    const fetchRutas = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/reservaciones/proximos-7-dias', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const data = await response.json();
            setRutas(data);
        } catch (error) {
            setError('Error al cargar las rutas disponibles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReservacion = async (ruta, parada) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/reservaciones/crear', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pasajeroId: userId,
                    rutaId: ruta.rutaId,
                    paradaId: parada.paradaId,
                    tipoRuta: 'NORMAL'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al crear la reservación');
            }

            setModal({
                isOpen: true,
                success: true,
                message: 'Reservación creada exitosamente'
            });
            
            fetchRutas();

        } catch (error) {
            setModal({
                isOpen: true,
                success: false,
                message: error.message
            });
        }
    };

    const filteredRutas = rutas.filter(ruta => 
        ruta.nombreRuta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.puntoInicioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.puntoFinalNombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <Modal 
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                success={modal.success}
                message={modal.message}
            />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Rutas Disponibles</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por nombre de ruta o destino..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRutas.map((ruta) => (
                        <div key={ruta.rutaId} className="bg-white rounded-xl shadow-lg p-6">
                            <div className="mb-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-semibold text-gray-800">{ruta.nombreRuta}</h3>
                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {new Date(ruta.fechaPublicacion).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4 text-gray-600">
                                    <div><span className="font-medium">Inicio:</span> {ruta.puntoInicioNombre}</div>
                                    <div><span className="font-medium">Final:</span> {ruta.puntoFinalNombre}</div>
                                    <div><span className="font-medium">Distancia:</span> {ruta.distancia} km</div>
                                    <div><span className="font-medium">Tiempo:</span> {ruta.tiempo}</div>
                                    <div><span className="font-medium">Horario:</span> {ruta.horario}</div>
                                    <div><span className="font-medium">Costo Gasolina:</span> ${ruta.costoGasolina}</div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Paradas Disponibles</h4>
                                <div className="space-y-2">
                                    {ruta.paradas.map((parada, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                            <div>
                                                <div className="font-medium text-gray-800">{parada.paradaNombre}</div>
                                                <div className="text-sm text-gray-600">
                                                    Distancia: {parada.distanciaParada} km
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-blue-600">
                                                    ${parada.costoParada}
                                                </div>
                                                <button
                                                    onClick={() => handleReservacion(ruta, parada)}
                                                    disabled={Boolean(parada.ocupado)}
                                                    className={`mt-2 px-4 py-1 rounded-lg text-sm ${
                                                        Boolean(parada.ocupado)
                                                        ? 'bg-gray-300 cursor-not-allowed' 
                                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                                    }`}
                                                >
                                                    {Boolean(parada.ocupado) ? 'Ocupado' : 'Reservar'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && filteredRutas.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 text-lg">No se encontraron rutas disponibles.</div>
                </div>
            )}
        </div>
    );
};

export default Pasajero;