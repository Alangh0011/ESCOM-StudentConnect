import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import Hero from './Hero';
import { Link } from 'react-router-dom';

function Register() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalError, setModalError] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        email: "",
        password: "",
        boleta: "",
        avisoPrivacidad: false,
        sexo: "",
        fotoPerfil: null,
        roles: ["pasajero"],
        placas: "",
        descripcion: "",
        modelo: "",
        color: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value
        });
    };

    const handleRoleChange = (e) => {
        setFormData({
            ...formData,
            roles: [e.target.value]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            const response = await axios.post('http://localhost:8080/auth/nuevo', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setModalMessage('Usuario registrado exitosamente');
            setModalError(false);
            setModalOpen(true);
        } catch (error) {
            setModalMessage(error.response?.data?.message || 'Ocurrió un error inesperado');
            setModalError(true);
            setModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full h-screen bg-gradient-to-bl from-blue-200 via-blue-400 to-blue-700 overflow-auto">
            <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-10 lg:py-0">
                <div className="bg-white px-6 py-10 sm:px-10 sm:py-20 rounded-3xl border-2 border-gray-100 shadow bg-opacity-50 w-full max-w-md lg:max-w-lg overflow-y-auto max-h-screen">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center">Registrar Conductor/Pasajero</h1>
                    <p className="font-medium text-lg text-gray-500 mt-4 text-center">Completa tus datos para registrarte</p>

                    {/* Formulario de registro */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-sm sm:text-base">
                        <div>
                            <label className="text-lg font-medium">Nombre</label>
                            <input
                                className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                placeholder="Tu nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-lg font-medium">Apellido Paterno</label>
                            <input
                                className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                placeholder="Tu apellido paterno"
                                name="apellidoPaterno"
                                value={formData.apellidoPaterno}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-lg font-medium">Apellido Materno</label>
                            <input
                                className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                placeholder="Tu apellido materno"
                                name="apellidoMaterno"
                                value={formData.apellidoMaterno}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-lg font-medium">Correo</label>
                            <input
                                className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                placeholder="Tu correo"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-lg font-medium">Contraseña</label>
                            <input
                                className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                placeholder="Contraseña"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-lg font-medium">Boleta</label>
                            <input
                                className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                placeholder="Número de boleta"
                                type="number"
                                name="boleta"
                                value={formData.boleta}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                name="avisoPrivacidad"
                                checked={formData.avisoPrivacidad}
                                onChange={handleChange}
                                required
                            />
                            <label className="ml-2">Acepto el Aviso de Privacidad</label>
                        </div>
                        <div>
                            <label className="text-lg font-medium">Sexo</label>
                            <select
                                className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                name="sexo"
                                value={formData.sexo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona tu sexo</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-lg font-medium">Foto de Perfil</label>
                            <input
                                className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                type="file"
                                name="fotoPerfil"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Selección de rol */}
                        <div className="mt-4">
                            <label className="text-lg font-medium">Rol</label>
                            <div className="flex items-center mt-2">
                                <input
                                    type="radio"
                                    id="pasajero"
                                    name="rol"
                                    value="pasajero"
                                    checked={formData.roles[0] === "pasajero"}
                                    onChange={handleRoleChange}
                                    className="mr-2"
                                />
                                <label htmlFor="pasajero" className="mr-4">Pasajero</label>
                                <input
                                    type="radio"
                                    id="conductor"
                                    name="rol"
                                    value="conductor"
                                    checked={formData.roles[0] === "conductor"}
                                    onChange={handleRoleChange}
                                    className="mr-2"
                                />
                                <label htmlFor="conductor">Conductor</label>
                            </div>
                        </div>

                        {/* Campos adicionales para conductor */}
                        {formData.roles[0] === "conductor" && (
                            <>
                                <div>
                                    <label className="text-lg font-medium">Placas</label>
                                    <input
                                        className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                        placeholder="Placas del vehículo"
                                        name="placas"
                                        value={formData.placas}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-lg font-medium">Descripción del Vehículo</label>
                                    <input
                                        className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                        placeholder="Descripción del vehículo"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="text-lg font-medium">Modelo del Vehículo</label>
                                    <input
                                        className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                        placeholder="Modelo del vehículo"
                                        name="modelo"
                                        value={formData.modelo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-lg font-medium">Color del Vehículo</label>
                                    <input
                                        className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                        placeholder="Color del vehículo"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="mt-8 flex flex-col gap-y-4">
                            <button
                                type="submit"
                                className="py-2 rounded-xl bg-green-500 text-white font-bold hover:scale-105 transition-transform"
                            >
                                Registrar
                            </button>
                        </div>
                    </form>

                    <Modal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        data={{ error: modalError, message: modalMessage }}
                    />
                </div>
            </div>
            <div className="hidden lg:flex h-full w-1/2 items-center justify-center">
                <Hero />
            </div>
        </div>
    );
}

export default Register;
