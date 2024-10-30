import React, { useState } from 'react';
import Hero from './Hero';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
    const history = useHistory();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalError, setModalError] = useState(false);
    const [formData, setFormData] = useState({
        nombreUsuario: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.nombreUsuario === "" || formData.password === "") {
            setModalMessage('Por favor complete todos los campos.');
            setModalError(true);
            setModalOpen(true);
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/auth/login', formData);
            const { token, authorities } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('authorities', JSON.stringify(authorities));
            setIsLoggedIn(true);
            history.push('/home');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full h-screen bg-gradient-to-bl from-blue-200 via-blue-400 to-blue-700">
            {/* Contenedor del formulario de inicio de sesión */}
            <div className="w-full lg:w-1/2 flex items-center justify-center h-full">
                <div className="bg-white px-6 py-10 sm:px-10 sm:py-20 rounded-3xl border-2 border-gray-100 shadow bg-opacity-50 w-11/12 max-w-md mx-auto lg:max-w-lg lg:mx-0 lg:h-auto lg:flex lg:flex-col lg:justify-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center">Bienvenido</h1>
                    <p className="text-slate-900 mt-4 text-center font-semibold ">¡Nos emociona formar parte de tu viaje!</p>
                    <div className="mt-8">
                        <label className="text-lg font-medium">Correo</label>
                        <input
                            className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                            placeholder="enter your name user"
                            value={formData.nombreUsuario}
                            onChange={handleChange}
                            name="nombreUsuario"
                            type="text"
                        />
                    </div>
                    <div className="mt-8">
                        <label className="text-lg font-medium">Contraseña</label>
                        <input
                            className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                            placeholder="enter your password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            name="password"
                        />
                    </div>
                    <div className="mt-8 flex justify-between items-center">
                        <div>
                            <input type="checkbox" id="remember" className="" />
                            <label htmlFor="remember" className="ml-2 font-medium">Remember for 30 days</label>
                        </div>
                        <button className="text-pink-800">¿Has olvidado la contraseña?</button>
                    </div>
                    <div className="mt-1 flex justify-between items-center">
                        <p>Todavía no tienes cuenta?</p>
                        <Link className="text-pink-800" to="/register"> Cree una</Link>
                    </div>
                    <div className="mt-8 flex flex-col gap-y-4">
                        <button 
                            onClick={handleSubmit}
                            className="py-2 rounded-xl bg-pink-950 text-white font-bold hover:scale-105 transition-transform"
                        >
                            Sign in
                        </button>
                    </div>
                    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} data={{ error: modalError, message: modalMessage }} />
                </div>
            </div>
            {/* Lado derecho: Hero en pantallas grandes */}
            <div className="hidden lg:flex h-full w-1/2 items-center justify-center">
                <Hero />
            </div>
        </div>
    );
}

export default Login;
