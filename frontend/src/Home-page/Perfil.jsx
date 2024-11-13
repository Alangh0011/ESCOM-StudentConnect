import React from 'react';
import { FaStar, FaCarSide } from 'react-icons/fa';

function Perfil({ userInfo, userRoles }) {
    // Limitar calificación a dos decimales, asegurándonos de que sea un número válido
    const calificacion = isNaN(parseFloat(userInfo.calificacion)) ? 0 : parseFloat(userInfo.calificacion).toFixed(2);

    // Renderizar la calificación en figuras
    const renderCalificacion = (calificacion) => {
        const maxRating = 5;
        const filledIcons = Math.min(Math.floor(calificacion), maxRating); // Limitar a un máximo de 5 íconos completos
        const halfIcon = calificacion % 1 >= 0.5 ? 1 : 0;
        const emptyIcons = maxRating - filledIcons - halfIcon;

        return (
            <div className="flex items-center space-x-1">
                {[...Array(filledIcons)].map((_, i) => (
                    <FaCarSide key={`filled-${i}`} className="text-yellow-400" />
                ))}
                {halfIcon === 1 && <FaCarSide className="text-yellow-400 opacity-50" />}
                {[...Array(emptyIcons)].map((_, i) => (
                    <FaCarSide key={`empty-${i}`} className="text-gray-300" />
                ))}
                <span className="ml-2 text-white/80">({calificacion})</span>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-700 p-6 rounded-xl shadow-lg text-white flex flex-col items-center lg:flex-row lg:justify-between lg:px-8">
            {/* Foto de perfil */}
            <div className="flex items-center">
                <img 
                    src="https://img.freepik.com/vector-gratis/ilustracion-joven-sonriente_1308-174669.jpg?t=st=1730592292~exp=1730595892~hmac=b81adb38c7c4c3d6c7bf4c65991720f57cb3a7c1885ecfa6371e7915f73d3bf3&w=740" 
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
                <p><span className="font-semibold">Calificación:</span> {renderCalificacion(calificacion)}</p>
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
