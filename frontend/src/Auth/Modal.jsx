import React from 'react';

const Modal = ({ isOpen, onClose, data }) => {
    // Función para cerrar el modal
    const closeModal = () => {
        onClose();
    };

    return (
        // Fragmento React para envolver el contenido condicional
        <>
            {/* Renderiza el modal solo si isOpen es true */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Fondo oscuro detrás del modal */}
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    {/* Contenedor del modal */}
                    <div className="fixed bg-white p-8 rounded-lg z-50">
                        {/* Título del modal: Error si hay un error, éxito de lo contrario */}
                        <h2 className="text-lg font-bold mb-4">{data.error ? 'Error' : 'Success'}</h2>
                        {/* Mensaje del modal */}
                        <p className="mb-4">{data.message}</p>
                        {/* Botón para cerrar el modal */}
                        <button onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;


