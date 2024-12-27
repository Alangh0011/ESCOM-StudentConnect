import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Home } from 'lucide-react';

function Login({ setIsLoggedIn }) {
    const history = useHistory();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalError, setModalError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
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
        if (formData.email === "" || formData.password === "") {
            setModalMessage('Por favor complete todos los campos.');
            setModalError(true);
            setModalOpen(true);
            return;
        }
        try {
            const response = await axios.post('https://studentconnect-backend.azurewebsites.net/auth/login', formData);
            const { token, authorities } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('authorities', JSON.stringify(authorities));
            
            setIsLoggedIn(true);
            history.push('/home');
        } catch (error) {
            console.error('Error:', error);
            setModalMessage('Correo o contraseña incorrectos');
            setModalError(true);
            setModalOpen(true);
        }
    };

    return (
        <>
            {/* Navbar simplificado */}
            <header className="fixed top-0 left-0 right-0 w-full bg-white transition-all duration-300 z-50 h-16 md:h-20">
                <div className="max-w-7xl mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">
                        {/* Logo */}
                        <h1 className="text-xl md:text-2xl font-bold">
                            <Link to="/" className="no-underline text-black">
                                Student Connect
                                <span className="cursor-pointer text-primary">.</span>
                            </Link>
                        </h1>

                        {/* Home Icon */}
                        <Link
                            to="/"
                            className="flex items-center text-tertiary py-2 px-4 no-underline transition-all gap-2 active:opacity-70"
                            aria-label="Inicio"
                        >
                            <Home className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-6xl flex flex-col-reverse md:flex-row shadow-2xl rounded-2xl overflow-hidden">
                    {/* Panel izquierdo oscuro */}
                    <div className="w-full md:w-2/5 bg-secundary p-8 md:p-12 text-white flex flex-col justify-center relative min-h-[200px] md:min-h-0">
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-4">¿No tienes una cuenta?</h2>
                            <p className="text-white mb-6 md:mb-8 text-sm md:text-base">
                                ¡Únete a nosotros! Crea una cuenta y comienza tu viaje con nosotros.
                            </p>
                            <Link
                                to="/register"
                                className="inline-block no-underline border border-white text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-primary hover:text-white active:bg-[#A92D6B] focus:bg-[#A92D6B] transition-colors duration-300 text-sm md:text-base touch-manipulation"
                            >
                                Registrarse
                            </Link>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-900/30" />
                    </div>

                    {/* Panel derecho - Formulario */}
                    <div className="w-full md:w-3/5 bg-tertiary p-8 md:p-12">
                        <div className="max-w-md mx-auto">
                            <h1 className="text-2xl md:text-3xl text-white font-semibold mb-8 md:mb-12">Iniciar Sesión</h1>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Campo Email */}
                                <div className="space-y-2">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Correo electrónico"
                                        className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                        required
                                    />
                                </div>
                                {/* Campo Password */}
                                <div className="space-y-2">
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Contraseña"
                                            className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm md:text-base active:text-gray-700"
                                        >
                                            {showPassword ? "Ocultar" : "Mostrar"}
                                        </button>
                                    </div>
                                </div>
                              
                                {/* Botón Login */}
                                <button
                                    type="submit"
                                    className="w-full md:w-32 bg-tertiary border border-white text-white px-6 py-2 md:py-3 rounded-lg hover:bg-[#A92D6B] active:bg-[#8B1B4D] focus:bg-[#A92D6B] transition-colors duration-300 text-sm md:text-base touch-manipulation"
                                >
                                    Ingresar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} data={{ error: modalError, message: modalMessage }} />
            </div>
        </>
    );
}

export default Login;