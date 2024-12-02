import React from 'react';
import { LogOut, Link2, Car, User, Home } from "lucide-react";
import { Link } from "react-router-dom";

function Perfil({ userInfo, userRoles, onLogout }) {
    const handleLogout = () => {
        localStorage.clear();
        if (onLogout) {
            onLogout();
        }
        window.location.href = '/login';
    };

    const calificacion = isNaN(parseFloat(userInfo.calificacion)) ? 0 : parseFloat(userInfo.calificacion).toFixed(2);

    const renderCalificacion = (calificacion) => {
        const maxRating = 5;
        const filledIcons = Math.min(Math.floor(calificacion), maxRating);
        const halfIcon = calificacion % 1 >= 0.5 ? 1 : 0;
        const emptyIcons = maxRating - filledIcons - halfIcon;

        return (
            <div className="flex items-center space-x-1">
                {[...Array(filledIcons)].map((_, i) => (
                    <Car key={`filled-${i}`} className="text-yellow-400 w-5 h-5 fill-yellow-400" />
                ))}
                {halfIcon === 1 && <Car className="text-yellow-400 opacity-50 w-5 h-5 fill-yellow-400" />}
                {[...Array(emptyIcons)].map((_, i) => (
                    <Car key={`empty-${i}`} className="text-gray-300 w-5 h-5" />
                ))}
                <span className="ml-2 text-white/80">({calificacion})</span>
            </div>
        );
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 w-full bg-white transition-all duration-300 z-50 h-16 md:h-20">
                <div className="max-w-7xl mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">
                        <h1 className="text-xl md:text-2xl font-bold">
                            <Link to="/" className="no-underline text-black">
                                Student Connect
                                <span className="cursor-pointer text-primary">.</span>
                            </Link>
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="group relative inline-flex items-center overflow-hidden px-4 py-2 text-tertiary transition-all hover:text-white active:opacity-70"
                            aria-label="Cerrar Sesión"
                        >
                            <span className="absolute inset-0 bg-tertiary rounded w-0 transition-all duration-300 ease-out group-hover:w-full"></span>
                            <LogOut className="w-5 h-5 relative z-10 transform transition-transform" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto  pt-16 md:pt-16">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Card - Left */}
                    <div className="md:w-1/5">
                        <div className="bg-tertiary shadow-sm rounded-xl p-4 min-h-[320px] md:h-[320px]">
                            <div className="flex flex-col items-center justify-center h-full mt-8 md:mt-0">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="pt-1">
                                        <img
                                            src="https://img.freepik.com/vector-gratis/ilustracion-joven-sonriente_1308-174669.jpg?t=st=1730592292~exp=1730595892~hmac=b81adb38c7c4c3d6c7bf4c65991720f57cb3a7c1885ecfa6371e7915f73d3bf3&w=740"
                                            alt="Foto de perfil"
                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                                        />
                                    </div>
                                    <div className="text-center w-full">
                                        <h2 className="text-xl font-bold text-white">{userInfo.nombre} {userInfo.apellidoPaterno}</h2>
                                        <p className="text-white/80 text-sm mt-1">{userInfo.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Card - Right */}
                    <div className="md:w-4/5">
                        <div className="bg-gradient-to-r from-cuarto to-secundary rounded-xl p-6 text-white min-h-[320px] md:h-[320px]">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Personal Information */}
                                <div className="w-full">
                                    <div className="flex items-center gap-2 mb-4 justify-center">
                                        <User className="w-5 h-5" />
                                        <h3 className="text-lg font-semibold">Información Personal</h3>
                                    </div>
                                    <div className="text-center space-y-4">
                                        <div>
                                            <p className="text-white/70">Boleta</p>
                                            <p className="font-medium">{userInfo.boleta}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/70">Rol</p>
                                            <p className="font-medium">{userRoles.join(', ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/70 mb-1">Calificación</p>
                                            <div className="flex justify-center">
                                                {renderCalificacion(calificacion)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Information */}
                                {userRoles.includes('ROLE_CONDUCTOR') && (
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 mb-4 justify-center">
                                            <Car className="w-5 h-5" />
                                            <h3 className="text-lg font-semibold">Detalles del Vehículo</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center">
                                                <p className="text-white/70">Placas</p>
                                                <p className="font-medium">{userInfo.placas}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white/70">Modelo</p>
                                                <p className="font-medium">{userInfo.modelo}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white/70">Descripción</p>
                                                <p className="font-medium">{userInfo.descripcion}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white/70">Color</p>
                                                <div className="flex items-center gap-2 justify-center">
                                                    <span className="w-4 h-4 rounded-full bg-red-500"></span>
                                                    <p className="font-medium">{userInfo.color}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Perfil;