import React, { useState } from 'react';
//import { FcGoogle } from "react-icons/fc";
//import { FaFacebook } from "react-icons/fa";
//import { FaGithub } from "react-icons/fa";
import Hero from './Hero'; // Componente que se muestra en el lado derecho de la pantalla
import { Link } from 'react-router-dom'; // Importación del componente Link de React Router
import Modal from './Modal'; // Componente Modal para mostrar mensajes de error
import axios from 'axios'; // Importación de axios para realizar solicitudes HTTP
import { useHistory } from 'react-router-dom'; // Importación de useHistory para redirigir a otras rutas



function Login({setIsLoggedIn}) {
    
    const history = useHistory(); // Hook useHistory para acceder a la historia de navegación

    // Estados para controlar el modal y su contenido
    const [modalOpen, setModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Estado para almacenar el mensaje a mostrar en el modal
    const [modalError, setModalError] = useState(false); // Estado para indicar si hay un error en el modal

    // Estado para almacenar los datos del formulario (nombre de usuario y contraseña)
    const [formData, setFormData] = useState({
        nombreUsuario: "",
        password: ""
    });

    // Función para manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validar si los campos de usuario y contraseña están vacíos
        if (formData.nombreUsuario === "" || formData.password === "") {
            setModalMessage('Por favor complete todos los campos.');
            setModalError(true);
            setModalOpen(true);
            return;
        }
        try {
            // Realizar una solicitud POST al servidor para iniciar sesión
            const response = await axios.post('http://localhost:8080/auth/login', formData);
            const { token, authorities } = response.data; // Desestructurar el token y las autoridades de la respuesta
            // Almacenar el token JWT y las autoridades en el almacenamiento local del navegador
            localStorage.setItem('token', token);
            localStorage.setItem('authorities', JSON.stringify(authorities)); // Convertir las autoridades a cadena JSON
            setIsLoggedIn(true); // Actualizar el estado de autenticación
            history.push('/home'); // Redirigir a la página de inicio después de iniciar sesión
        } catch (error) {
            console.error('Error:', error);
            // Manejar errores de inicio de sesión
        }
    };

    return (
        <div className="flex w-full h-screen">
            {/* Lado izquierdo de la pantalla: formulario de inicio de sesión */}
            <div className="w-full flex items-center justify-center lg:w-1/2 bg-gray-200">
                <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray-100 shadow bg-opacity-50">
                    {/* Título y descripción del formulario */}
                    <h1 className="text-5xl font-semibold">WELCOME</h1>
                    <p className="font-medium text-lg text-gray-500 mt-4">Welcome back! Please enter your details</p>
                     {/* Campos de nombre de usuario y contraseña del formulario */}
                    <div className="mt-8">
                    <div>
                        <label className="text-lg font-medium">User Name</label>
                        <input
                        className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                        placeholder="enter your name user"
                        value={formData.nombreUsuario}
                        onChange={handleChange}
                        name='nombreUsuario'
                        type='text'
                        />
                    </div>
                </div>
                <div className="mt-8">
                    <div>
                        <label className="text-lg font-medium">Password</label>
                        <input
                        className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                        placeholder="enter your password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        name='password'/>
                    </div>
                </div>
                {/* Opciones adicionales y enlaces del formulario */}
                <div className="mt-8 flex justify-between items-center">
                    <div>
                        <input
                        type="checkbox"
                        id="remember"
                        className=""/>
                        <label htmlFor="remember"
                        className="mt-2 font-medium text-base">Remember for 30 days</label>
                    </div>
                    <button className="font-medium text-base text-green-500">Forgot password</button>
                </div>
                <div className="mt-1 flex justify-between items-center">
                    <p className="mt-1 font-medium text-base">You do not have an account?</p>
                    <Link 
                    className="font-medium text-base text-green-500"
                    to="/register">Go to Register</Link>
                </div>
                {/* Botón para iniciar sesión */}
                <div className="mt-8 flex flex-col gap-y-4">
                    <button 
                    onClick={handleSubmit}
                    className="active:scale-[.98] active:duration-80 transition-all py-2 rounded-xl bg-green-500 text-white text-lg font-bold hover:scale-[1.1] ease-in-out">Sign in</button>
                </div>
                {/* 
                <div className="mt-8 flex mx-auto space-x-10 justify-center">
                    <button className="border-2 border-gray-100 rounded-md px-4 py-2 mt-2 active:scale-[1.1] active:duration-80 transition-all hover:scale-[1.2] ease-in-out">
                        <FcGoogle className="text-4xl "/>
                    </button>
                    <button className="border-2 border-gray-100 rounded-md px-4 py-2 mt-2 active:scale-[1.1] active:duration-80 transition-all hover:scale-[1.2] ease-in-out">
                        <FaFacebook className="text-4xl text-blue-700"/>
                    </button>
                    <button className="border-2 border-gray-100 rounded-md px-4 py-2 mt-2 active:scale-[1.1] active:duration-80 transition-all hover:scale-[1.2] ease-in-out">
                        <FaGithub className="text-4xl"/>
                    </button>
                </div>
                */}

                {/* Componente Modal para mostrar mensajes de error */}
                <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                data={{ error: modalError, message: modalMessage }} />
            </div>
        </div>
        {/* Lado derecho de la pantalla: componente Hero */}
        <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
            <Hero/>
        </div>
</div>
    )
}   

export default Login