import React from 'react';

const PrivacyPolicyModal = ({ isOpen, onAccept, onDecline }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-8 rounded-lg z-50 max-w-lg mx-4 text-gray-700">
                <h2 className="text-lg font-bold mb-4">Aviso de Privacidad</h2>
                <p className="mb-4">
                    Este es el contenido del aviso de privacidad. Por favor, léelo atentamente antes de continuar.
                </p>
                <p className="mb-4">
                    Al aceptar este aviso, autorizas el uso de tus datos para el propósito de esta aplicación.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onDecline}
                        className="bg-secundary hover:bg-primary text-white font-bold py-2 px-4 rounded"
                    >
                        Declinar
                    </button>
                    <button
                        onClick={onAccept}
                        className="bg-tertiary hover:bg-[#A92D6B] text-white font-bold py-2 px-4 rounded"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyModal;
