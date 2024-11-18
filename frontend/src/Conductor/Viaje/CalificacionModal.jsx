import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { calificarPasajero } from '../../utils/rutaAPI';

const CalificacionModal = ({ viaje, onClose }) => {
    const [pasajerosCalificaciones, setPasajerosCalificaciones] = useState([]);
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (viaje?.pasajeros && Array.isArray(viaje.pasajeros)) {
            console.log('Inicializando calificaciones para pasajeros:', viaje.pasajeros);
            const calificacionesIniciales = viaje.pasajeros.map(pasajero => ({
                pasajeroId: pasajero.id,
                nombre: `${pasajero.nombre} ${pasajero.apellidoPaterno}`,
                boleta: pasajero.boleta,
                calificacion: 5,
                comentario: ''
            }));
            setPasajerosCalificaciones(calificacionesIniciales);
        } else {
            console.warn('No hay pasajeros en el viaje o datos incorrectos:', viaje);
            setSubmitError('No se encontraron pasajeros para calificar');
        }
    }, [viaje]);

    const handleCalificacionChange = (index, calificacion) => {
        setPasajerosCalificaciones(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, calificacion } : item
            )
        );
    };

    const handleComentarioChange = (index, comentario) => {
        setPasajerosCalificaciones(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, comentario } : item
            )
        );
    };

    const handleSubmit = async () => {
        if (!viaje?.id) {
            setSubmitError('Error: ID del viaje no disponible');
            return;
        }

        if (pasajerosCalificaciones.length === 0) {
            setSubmitError('No hay pasajeros para calificar');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        
        try {
            // Enviar calificaciones una por una
            for (const calificacion of pasajerosCalificaciones) {
                const requestData = {
                    viajeId: viaje.id,
                    pasajeroId: calificacion.pasajeroId,
                    calificacion: calificacion.calificacion,
                    comentario: calificacion.comentario || ''
                };
                
                console.log('Enviando calificación:', requestData);
                await calificarPasajero(requestData);
            }

            toast.success('Calificaciones enviadas correctamente');
            onClose();
        } catch (error) {
            console.error('Error al enviar calificaciones:', error);
            setSubmitError('Error al enviar las calificaciones: ' + 
                (error.response?.data?.mensaje || error.message || 'Error desconocido'));
            toast.error('Error al enviar las calificaciones');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Calificar Pasajeros</h2>
                            <p className="text-sm text-gray-600">
                                Ruta: {viaje?.nombreRuta || 'No disponible'}
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {submitError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {submitError}
                        </div>
                    )}

                    <div className="space-y-6">
                        {pasajerosCalificaciones.map((pasajero, index) => (
                            <div 
                                key={pasajero.pasajeroId} 
                                className="bg-gray-50 p-4 rounded-lg"
                            >
                                <div className="flex justify-between mb-2">
                                    <h3 className="font-medium">{pasajero.nombre}</h3>
                                    <span className="text-gray-500">Boleta: {pasajero.boleta}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => handleCalificacionChange(index, star)}
                                                disabled={isSubmitting}
                                                className="focus:outline-none transition-transform disabled:opacity-50"
                                            >
                                                <Star
                                                    size={24}
                                                    className={`${
                                                        star <= pasajero.calificacion
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                    } hover:scale-110`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-gray-600 ml-2">
                                        ({pasajero.calificacion}/5)
                                    </span>
                                </div>

                                <textarea
                                    value={pasajero.comentario}
                                    onChange={(e) => handleComentarioChange(index, e.target.value)}
                                    placeholder="Añade un comentario (opcional)"
                                    className="w-full p-2 border border-gray-300 rounded-lg 
                                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                             disabled:opacity-50 disabled:bg-gray-100"
                                    rows="2"
                                    disabled={isSubmitting}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 rounded-lg 
                                     hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                                     hover:bg-blue-600 disabled:opacity-50 
                                     disabled:bg-blue-300"
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Calificaciones'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalificacionModal;