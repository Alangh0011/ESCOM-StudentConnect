import React from 'react';
import { Link } from "react-router-dom";

const Pagina = ({ onLogout }) => {
    return (
        <div className="w-full bg-gradient-to-r from-cuarto to-secundary py-4 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-sm text-white text-center md:text-left">
                        © 2024 Student Connect. Todos los derechos reservados.
                    </span>
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm">
                        <Link to="/terminos" className="no-underline text-white hover:text-gray-200">
                            Términos y condiciones
                        </Link>
                        <span className="text-white hidden md:inline">|</span>
                        <Link to="/priv" className="no-underline text-white hover:text-gray-200">
                            Política de privacidad
                        </Link>
                        <span className="text-white hidden md:inline">|</span>
                        <button
                            onClick={onLogout}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pagina;