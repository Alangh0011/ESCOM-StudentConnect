import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import Perfil from './Perfil';
import Conductor from '../Conductor/Conductor';
import Pasajero from '../Pasajero/Pasajero';

function Home({ onLogout }) {
    const [userRoles, setUserRoles] = useState([]);
    const [userInfo, setUserInfo] = useState({
        id: null,
        nombre: '',
        apellidoPaterno: '',
        boleta: '',
        placas: null,
        descripcion: null,
        modelo: null,
        color: null,
        email: '',
        calificacion: null
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const roles = decodedToken.roles.map(role => role.authority);
                setUserRoles(roles);
                setUserInfo({
                    id: decodedToken.id,
                    nombre: decodedToken.nombre,
                    apellidoPaterno: decodedToken.apellidoPaterno,
                    boleta: decodedToken.boleta,
                    placas: decodedToken.placas || "No aplica",
                    descripcion: decodedToken.descripcion || "No aplica",
                    modelo: decodedToken.modelo || "No aplica",
                    color: decodedToken.color || "No aplica",
                    email: decodedToken.sub,
                    calificacion: decodedToken.calificacion
                });
            } catch (error) {
                console.error('Error al decodificar el token', error);
                handleLogout();
            }
        } else {
            console.error('No se encontró el token en el almacenamiento local. Por favor, inicie sesión de nuevo.');
            handleLogout();
        }
    }, []);

    const handleLogout = () => {
        setUserRoles([]);
        setUserInfo({
            id: null,
            nombre: '',
            apellidoPaterno: '',
            boleta: '',
            placas: null,
            descripcion: null,
            modelo: null,
            color: null,
            email: '',
            calificacion: null
        });
        localStorage.clear();
        onLogout();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile section sin container para máximo ancho */}
            <div className="w-full">
                <Perfil
                    userInfo={userInfo}
                    userRoles={userRoles}
                    onLogout={handleLogout}
                />
            </div>
            
            {/* Contenido del conductor/pasajero con container */}
            <div className="container mx-auto px-4">
                {userInfo.id ? (
                    userRoles.includes('ROLE_CONDUCTOR') ? (
                        <Conductor userId={userInfo.id} />
                    ) : (
                        <Pasajero userId={userInfo.id} />
                    )
                ) : (
                    <p className="text-center mt-4 text-red-500">
                        El ID del usuario no está disponible. Por favor, inicie sesión de nuevo.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Home;