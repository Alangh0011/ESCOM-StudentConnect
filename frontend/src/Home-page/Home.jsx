import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import Perfil from './Perfil';
import Conductor from '../Conductor/Conductor';
import Pasajero from '../Pasajero/Pasajero'; // Asegúrate de que la ruta sea correcta

function Home({ onLogout }) {
    
    const handleLogout = () => {
        onLogout();
      };
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
        email: ''
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
                    email: decodedToken.sub
                });
            } catch (error) {
                console.error('Error al decodificar el token', error);
            }
        } else {
            console.error('No se encontró el token en el almacenamiento local. Por favor, inicie sesión de nuevo.');
        }
    }, []);

    return (
        <div className="container mx-auto p-4">
            <Perfil userInfo={userInfo} userRoles={userRoles} />
            {userInfo.id ? (
                userRoles.includes('ROLE_CONDUCTOR') ? (
                    <Conductor userId={userInfo.id} />
                ) : (
                    <Pasajero userId={userInfo.id} />
                )
            ) : (
                <p>El ID del usuario no está disponible. Por favor, inicie sesión de nuevo.</p>
            )}
        </div>
    );
}

export default Home;