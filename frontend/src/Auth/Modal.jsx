import React from 'react';

const Modal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-80 max-w-[90%]">
                {/* Header */}
                <div className={`px-6 py-4 border-b ${data.error ? 'bg-red-50' : 'bg-green-50'}`}>
                    <h3 className={`text-xl font-bold tracking-tight ${
                        data.error ? 'text-red-700' : 'text-green-700'
                    }`}>
                        {data.error ? 'Error' : 'Éxito'}
                    </h3>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <p className="text-gray-700 font-medium text-base">
                        {data.message}
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all duration-200 transform hover:scale-105
                            ${data.error 
                                ? 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-200' 
                                : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-200'
                            }`}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;