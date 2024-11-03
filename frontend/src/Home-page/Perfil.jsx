import React from 'react';

function Perfil({ userInfo, userRoles }) {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-700 p-6 rounded-xl shadow-lg text-white flex flex-col items-center lg:flex-row lg:justify-between lg:px-8">
            {/* Foto de perfil */}
            <div className="flex items-center">
                <img 
                    src="https://img.freepik.com/vector-gratis/ilustracion-joven-sonriente_1308-174669.jpg?t=st=1730592292~exp=1730595892~hmac=b81adb38c7c4c3d6c7bf4c65991720f57cb3a7c1885ecfa6371e7915f73d3bf3&w=740" // Reemplaza con la URL de la imagen del perfil o usa un avatar por defecto
                    alt="Foto de perfil"
                    className="w-20 h-20 rounded-full border-4 border-white"
                />
                <div className="ml-4">
                    <h2 className="text-2xl font-bold">{userInfo.nombre} {userInfo.apellidoPaterno}</h2>
                    <p className="text-sm text-white/80">{userInfo.email}</p>
                </div>
            </div>

            {/* Información del usuario */}
            <div className="mt-6 lg:mt-0 lg:text-left">
                <p><span className="font-semibold">Boleta:</span> {userInfo.boleta}</p>
                <p><span className="font-semibold">Rol:</span> {userRoles.join(', ')}</p>
            </div>

            {/* Información del vehículo (si el usuario es conductor) */}
            {userRoles.includes('ROLE_CONDUCTOR') && (
                <div className="mt-6 lg:mt-0 lg:text-left">
                    <h3 className="font-semibold">Detalles del Vehículo</h3>
                    <p><span className="font-semibold">Placas:</span> {userInfo.placas}</p>
                    <p><span className="font-semibold">Descripción:</span> {userInfo.descripcion}</p>
                    <p><span className="font-semibold">Modelo:</span> {userInfo.modelo}</p>
                    <p><span className="font-semibold">Color:</span> {userInfo.color}</p>
                </div>
            )}
        </div>
    );
}

export default Perfil;
