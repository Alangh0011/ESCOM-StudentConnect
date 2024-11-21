// eslint-disable-next-line no-unused-vars
import React from 'react';

const Forms = () => {
  return (            
    <section className="bg-blue-50 p-8 mx-auto my-8">
      <h2 className="text-lg font-semibold text-secundary capitalize">¿Tienes dudas? Contáctanos</h2>
      <form>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          {/* Campos de Correo institucional y Nombre completo */}
          <div className="flex flex-col">
            <label className="text-secundary" htmlFor="emailAddress">
              Correo institucional <span className="text-red-500">*</span>
            </label>
            <input
              id="emailAddress"
              type="email"
              placeholder="Correo institucional"
              className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-secundary" htmlFor="username">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Nombre completo"
              className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Campo de Boleta que ocupa toda la fila */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-secundary" htmlFor="boleta">
              Boleta <span className="text-red-500">*</span>
            </label>
            <input
              id="boleta"
              type="text"
              placeholder="Boleta"
              className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Campo de Cuéntanos en qué podemos ayudarte que ocupa toda la fila y es más alto */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-secundary" htmlFor="help">
              Cuéntanos en qué podemos ayudarte <span className="text-red-500">*</span>
            </label>
            <textarea
              id="help"
              placeholder="Escribe tu mensaje aquí"
              className="block w-full px-4 py-2 mt-2 h-32 border border-gray-300 rounded-md focus:border-blue-400 focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-tertiary rounded-md hover:bg-pink-800 focus:outline-none"
          >
            Enviar
          </button>
        </div>
      </form>
    </section> 
  );
};

export default Forms;
