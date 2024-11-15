import React, { useState, useEffect } from 'react';
import { SearchIcon, MapPin, Clock, Calendar, DollarSign, Users } from 'lucide-react';

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

const RutaCard = ({ ruta, onReservar }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800">{ruta.nombreRuta}</h3>
          <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(ruta.fechaPublicacion).toLocaleDateString()}
          </div>
        </div>

        {/* Información de la ruta */}
        <div className="mt-4 space-y-2 text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="font-medium">Ruta:</span>
            <span className="ml-2">{ruta.puntoInicioNombre} → {ruta.puntoFinalNombre}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span className="font-medium">Horario:</span>
            <span className="ml-2">{ruta.horario}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>Gasolina: ${ruta.costoGasolina}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{ruta.numeroPasajeros}/{ruta.numeroParadas} lugares</span>
            </div>
          </div>
        </div>
      </div>

      {/* Paradas */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 mb-3">Paradas Disponibles</h4>
        <div className="space-y-3">
          {ruta.paradas.map((parada) => (
            <div 
              key={parada.paradaId} 
              className={`relative overflow-hidden rounded-lg border transition-all ${
                parada.ocupado ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-100 hover:border-blue-300'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-800">{parada.paradaNombre}</h5>
                    <div className="mt-1 text-sm text-gray-500">
                      Distancia: {parada.distanciaParada} km
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">${parada.costoParada}</div>
                    <button
                      onClick={() => !parada.ocupado && onReservar(ruta, parada)}
                      className={`mt-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        parada.ocupado
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                      disabled={parada.ocupado}
                    >
                      {parada.ocupado ? (
                        parada.pasajero ? 'Reservado' : 'Ocupado'
                      ) : (
                        'Reservar'
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {parada.ocupado && parada.pasajero && (
                <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-2 py-1 text-xs rounded-bl-lg">
                  Reservado por: {parada.pasajero.nombre}
                </div>
              )}
            </div>
          ))}
        </div>
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
                    tipoRuta: ruta.tipoRuta
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
        ruta.puntoFinalNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.paradas.some(parada => 
            parada.paradaNombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <Modal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Rutas Disponibles</h2>
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder="Buscar por ruta, destino o parada..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredRutas.length > 0 ? (
                            filteredRutas.map((ruta) => (
                                <RutaCard 
                                    key={ruta.rutaId} 
                                    ruta={ruta} 
                                    onReservar={handleReservacion}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow">
                                <div className="text-gray-500 text-lg">
                                    No se encontraron rutas disponibles.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pasajero;