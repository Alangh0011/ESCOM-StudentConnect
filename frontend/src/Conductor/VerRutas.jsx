import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom'; // Cambiado useNavigate por useHistory
import { getRutasConductor, eliminarRuta } from '../utils/rutaAPI';
import DeleteRouteModal from './DeleteRouteModal';
import EditVehicleModal from './EditVehicleModal';
import { SearchIcon, User, UserX } from 'lucide-react';
import { formatearFechaLocal } from '../utils/dateUtils';



const VerRutas = ({ userId, onSuccess, onError }) => {
    const history = useHistory(); // Usando history en lugar de navigate
    const [rutas, setRutas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRuta, setSelectedRuta] = useState(null);
    const [showEditVehicle, setShowEditVehicle] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRutas = useCallback(async () => {
        if (!userId) return;
    
        try {
            setIsLoading(true);
            setError(null);
            const data = await getRutasConductor(userId);
            
            if (data && Array.isArray(data)) {
                const rutasProcesadas = data.map(ruta => {
                    console.log('Original fechaProgramada:', ruta.fechaProgramada); // Log original
                    const fechaFormateada = formatearFechaLocal(ruta.fechaProgramada);
                    console.log('Formateada fechaProgramada:', fechaFormateada); // Log formateada
                    
                    return {
                        ...ruta,
                        fechaProgramada: fechaFormateada, // Usar la función de utilidad
                        distancia: Number(ruta.distancia) || 0,
                        numeroPasajeros: Number(ruta.numeroPasajeros) || 0,
                        numeroParadas: Number(ruta.numeroParadas) || 0,
                        paradas: Array.isArray(ruta.paradas) ? ruta.paradas.map(parada => ({
                            ...parada,
                            pasajeroInfo: parada.pasajeroInfo || null,
                            ocupado: parada.ocupado || false
                        })) : []
                    };
                });
    
                console.log('Rutas procesadas:', rutasProcesadas);
                setRutas(rutasProcesadas);
            } else {
                throw new Error('No se recibieron datos válidos del servidor');
            }
        } catch (error) {
            console.error('Error al cargar rutas:', error);
            setError(error.message || 'Error al cargar las rutas');
            if (onError) onError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [userId, onError]);
    

    useEffect(() => {
        fetchRutas();
    }, [fetchRutas]);

    const handleDeleteRuta = async (rutaId) => {
        try {
            await eliminarRuta(rutaId);
            await fetchRutas();
            if (onSuccess) onSuccess('Ruta eliminada exitosamente');
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error al eliminar ruta:', error);
            if (onError) onError('Error al eliminar la ruta');
        }
    };

    const filteredRutas = rutas.filter((ruta) => {
        if (!searchTerm) return true;
        
        const search = searchTerm.toLowerCase();
        const fechaMatch = ruta.fechaProgramada?.toLowerCase().includes(search) || false;
        const nombreRutaMatch = ruta.nombreRuta?.toLowerCase().includes(search) || false;
        const paradaMatch = ruta.paradas?.some(parada => 
            parada.paradaNombre?.toLowerCase().includes(search)
        ) || false;

        return fechaMatch || nombreRutaMatch || paradaMatch;
    });

    const ParadaCard = ({ parada }) => (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-medium text-gray-800">{parada.paradaNombre}</div>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                        <div>Distancia: {parada.distanciaParada?.toFixed(2) || 0} km</div>
                        <div>Costo: ${parada.costoParada?.toFixed(2) || 0}</div>
                    </div>
                </div>
                <div className="flex items-center">
                    {parada.pasajero ? ( // Cambiar pasajeroInfo por pasajero
                        // Si hay información del pasajero
                        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            <User className="h-4 w-4 mr-2" />
                            <div>
                                <div className="text-sm font-medium">
                                    {`${parada.pasajero.nombre} ${parada.pasajero.apellidoPaterno}`}
                                </div>
                                <div className="text-xs">
                                    Boleta: {parada.pasajero.boleta}
                                </div>
                            </div>
                        </div>
                    ) : parada.ocupado ? (
                        // Si está ocupado pero no hay info del pasajero
                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
                            <UserX className="h-4 w-4 mr-2" />
                            Reservado
                        </div>
                    ) : (
                        // Si no está ocupado
                        <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                            Disponible
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Error:</strong>
                    <div className="block sm:inline ml-2">{error}</div>
                    <button 
                        className="absolute top-0 right-0 px-4 py-3"
                        onClick={() => setError(null)}
                    >
                        ×
                    </button>
                </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mis Rutas en 7 días</h2>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar rutas o paradas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                    <button
                        onClick={() => setShowEditVehicle(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Editar Vehículo
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRutas.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                            <div className="text-gray-500 text-lg">No se encontraron rutas.</div>
                        </div>
                    ) : (
                        filteredRutas.map((ruta) => (
                            <div key={ruta.rutaId} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{ruta.nombreRuta}</h3>
                                        <div className="mt-2 space-y-1">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Distancia:</span> {ruta.distancia?.toFixed(2) || 0} km
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Fecha:</span> {ruta.fechaProgramada}
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Horario:</span> {ruta.horario}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium text-sm text-gray-600">Estado:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    ruta.numeroPasajeros >= ruta.numeroParadas
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {ruta.numeroPasajeros}/{ruta.numeroParadas} asientos ocupados
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedRuta(ruta);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-800 mb-3">Paradas</h4>
                                    <div className="space-y-3">
                                    {ruta.paradas && ruta.paradas.length > 0 ? (
                                            ruta.paradas.map((parada, index) => {
                                                console.log('Datos de parada:', parada); // Agregar este log
                                                return <ParadaCard key={parada.paradaId || index} parada={parada} />;
                                            })
                                        ) : (
                                            <div className="text-gray-500">No hay paradas registradas</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showDeleteModal && (
                <DeleteRouteModal
                    ruta={selectedRuta}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => handleDeleteRuta(selectedRuta.rutaId)}
                />
            )}

            {showEditVehicle && (
                <EditVehicleModal
                    userId={userId}
                    onClose={() => setShowEditVehicle(false)}
                    onSuccess={(message) => {
                        onSuccess(message);
                        setShowEditVehicle(false);
                    }}
                    onError={onError}
                />
            )}
        </div>
    );
};

export default VerRutas;