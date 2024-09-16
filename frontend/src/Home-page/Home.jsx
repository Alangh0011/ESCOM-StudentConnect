import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import User from './User';
import Admin from './Admin';
import { jwtDecode } from "jwt-decode";

const Home = () => {
    // Estado para almacenar los roles del usuario
    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        // Obtener el token del almacenamiento local
        const token = localStorage.getItem('token');

        if (token) {
            try {
                // Decodificar el token JWT
                const decodedToken = jwtDecode(token);

                // Verificar si el token decodificado tiene los roles del usuario
                if (decodedToken && decodedToken.roles) {
                    // Obtener los roles del usuario desde la carga útil (payload) del token
                    const roles = decodedToken.roles.map(role => role.authority);

                    // Actualizar el estado con los roles del usuario
                    setUserRoles(roles);
                    console.log('Roles:', roles); // Agrega esta línea para depurar los roles del usuario
                }
            } catch (error) {
                // Manejo de errores al decodificar el token
                console.error('Error al decodificar el token', error);
                console.log('Token:', token); // Agrega esta línea para ver el token en caso de error
            }
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <Navbar />
            {/* Utiliza los roles del usuario para determinar qué vista mostrar */}
            {userRoles.includes('ROLE_ADMIN') ? <Admin /> : <User />}
        </div>
    );
};

export default Home;
