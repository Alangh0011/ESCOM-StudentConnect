import React from 'react';
import { CheckCircle, XCircle, XIcon } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    return (
        <div className={`
            fixed top-4 right-4 z-50 
            flex items-center 
            min-w-[320px] px-4 py-3 rounded-lg shadow-lg
            ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}
        `}>
            <div className="flex items-center">
                {type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-3" />
                ) : (
                    <XCircle className="h-5 w-5 mr-3" />
                )}
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="ml-auto"
            >
                <XIcon className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;