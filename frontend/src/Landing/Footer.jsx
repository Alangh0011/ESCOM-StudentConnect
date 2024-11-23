import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaUser, FaLock } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-cuarto to-primary text-white pt-10 pb-6">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          {/* Account Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Cuenta</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="flex items-center gap-2 text-white no-underline hover:text-gray-200">
                  <FaUser /> Inicia Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="flex items-center gap-2 text-white no-underline hover:text-gray-200">
                  <FaLock /> Registro
                </Link>
              </li>
            </ul>
          </div>
          {/* Legal Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Legal</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/terminos" className="text-white no-underline hover:text-gray-200">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/priv" className="text-white no-underline hover:text-gray-200">
                  Politica De Privacidad
                </Link>
              </li>
            </ul>
          </div>
          {/* Soporte */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Soporte</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/FAQ" className="text-white no-underline hover:text-gray-200">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>
          {/* Social Links */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Redes Sociales</h2>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white text-blue-800 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white text-blue-800 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        {/* Divider */}
        <hr className="my-8 border-t border-gray-200 opacity-50" />
        {/* Copyright Section */}
        <div className="text-center text-sm">
          <p>Copyright © 2024. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;