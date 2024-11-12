// DeleteRouteModal.jsx
import React from 'react';

const DeleteRouteModal = ({ ruta, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
                <h3 className="text-2xl font-bold mb-4">¿Eliminar ruta?</h3>
                <p className="text-gray-600 mb-6">
                    Al eliminar esta ruta tu calificación bajará 0.2 estrellas. 
                    ¿Estás seguro de que deseas eliminar "{ruta.nombreRuta}"?
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteRouteModal;