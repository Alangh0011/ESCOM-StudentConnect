import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

const CalificacionModal = ({ isOpen, onClose, onCalificar }) => {
    const [calificacion, setCalificacion] = useState(5);
    const [comentario, setComentario] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await onCalificar({ calificacion, comentario });
        } catch (error) {
            console.error('Error al calificar:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Califica tu viaje</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-2">¿Cómo calificarías a tu conductor?</p>
                    <div className="flex space-x-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setCalificacion(star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    size={32}
                                    className={`${
                                        star <= calificacion
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    } hover:scale-110 transition-transform`}
                                />
                            </button>
                        ))}
                    </div>
                    
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="¿Algo que quieras comentar sobre el servicio?"
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalificacionModal;