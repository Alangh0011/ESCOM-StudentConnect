import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';

const Pasajero = ({ userId }) => {
    const [rutas, setRutas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRutas();
    }, []);

    const fetchRutas = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Para debugging

            const response = await fetch('http://localhost:8080/api/reservaciones/proximos-7-dias', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos:', data); // Para debugging
            setRutas(data);
        } catch (error) {
            console.error('Error completo:', error);
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

            if (!response.ok) {
                throw new Error('Error al crear la reservación');
            }

            alert('Reservación creada exitosamente');
        } catch (error) {
            alert('Error al crear la reservación: ' + error.message);
        }
    };

    const filteredRutas = rutas.filter(ruta => 
        ruta.nombreRuta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.puntoInicioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.puntoFinalNombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Rutas Disponibles</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por nombre de ruta o destino..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <div className="block sm:inline">{error}</div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRutas.map((ruta) => (
                    <div key={ruta.rutaId} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
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

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Información del Conductor</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="font-medium">Conductor:</span> {ruta.conductorNombre} {ruta.conductorApellido}</div>
                                <div><span className="font-medium">Email:</span> {ruta.conductorEmail}</div>
                                <div><span className="font-medium">Vehículo:</span> {ruta.vehiculoModelo}</div>
                                <div><span className="font-medium">Color:</span> {ruta.vehiculoColor}</div>
                                <div><span className="font-medium">Placas:</span> {ruta.vehiculoPlacas}</div>
                                <div><span className="font-medium">Descripción:</span> {ruta.vehiculoDescripcion}</div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Paradas Disponibles</h4>
                            <div className="space-y-2">
                                {ruta.paradas.map((parada, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                        <div>
                                            <div className="font-medium text-gray-800">{parada.paradaNombre}</div>
                                            <div className="text-sm text-gray-600">Distancia: {parada.distanciaParada} km</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-blue-600">${parada.costoParada}</div>
                                            <button
                                                onClick={() => handleReservacion(ruta, parada)}
                                                className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                            >
                                                Reservar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!isLoading && filteredRutas.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 text-lg">No se encontraron rutas disponibles.</div>
                </div>
            )}
        </div>
    );
};

export default Pasajero;