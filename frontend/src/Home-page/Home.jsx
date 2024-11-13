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
                handleLogout(); // Si hay error con el token, hacer logout
            }
        } else {
            console.error('No se encontró el token en el almacenamiento local. Por favor, inicie sesión de nuevo.');
            handleLogout(); // Si no hay token, hacer logout
        }
    }, []);

    const handleLogout = () => {
        // Limpiar estados locales
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

        // Limpiar localStorage
        localStorage.clear();
        
        // Llamar a la función onLogout del padre
        onLogout();
    };

    return (
        <div className="container mx-auto p-4">
            <Perfil 
                userInfo={userInfo} 
                userRoles={userRoles} 
                onLogout={handleLogout} // Pasar la función handleLogout al componente Perfil
            />
            
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
    );
}

export default Home;