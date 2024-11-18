import React from 'react';

const EstadoConexion = ({ conectado }) => (
    <div className={`flex items-center ${conectado ? 'text-green-500' : 'text-red-500'}`}>
        <div className={`w-2 h-2 rounded-full ${conectado ? 'bg-green-500' : 'bg-red-500'} mr-2`} />
        {conectado ? 'Conectado' : 'Desconectado'}
    </div>
);

export default EstadoConexion;