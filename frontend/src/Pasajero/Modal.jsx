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
export default Modal;