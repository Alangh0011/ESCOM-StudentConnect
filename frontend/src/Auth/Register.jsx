import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import Hero from './Hero';
import PrivacyPolicyModal from './PrivacyPolicyModal'; // Importamos el nuevo componente
import { useHistory, Link } from 'react-router-dom';

function Register() {
    const history = useHistory();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalError, setModalError] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(true); // Estado para mostrar el aviso de privacidad

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
        
        if (name === 'boleta') {
            // Remover cualquier caracter no numérico y limitar a 10 dígitos
            const boletaValue = value.replace(/\D/g, '').slice(0, 10);
            
            setFormData(prev => ({
                ...prev,
                [name]: boletaValue
            }));
            
            // Validación en tiempo real
            if (boletaValue.length === 10) {
                const tiene63 = boletaValue.slice(4, 6) === "63";
                const longitudCorrecta = boletaValue.length === 10;
                console.log('Validación en tiempo real:', {
                    boleta: boletaValue,
                    longitud: boletaValue.length,
                    longitudCorrecta,
                    digitos63: boletaValue.slice(4, 6),
                    esValida: tiene63 && longitudCorrecta
                });
            }
            return;
        }
    
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value
        }));
    };


    const handleRoleChange = (e) => {
        setFormData({
            ...formData,
            roles: [e.target.value]
        });
    };

    const handlePrivacyAccept = () => {
        setFormData({ ...formData, avisoPrivacidad: true });
        setShowPrivacyModal(false); // Cierra el aviso de privacidad
    };

    const handlePrivacyDecline = () => {
        setShowPrivacyModal(false);
        setFormData({ ...formData, avisoPrivacidad: false });
    };

    const validateFields = () => {
        // Validación de boleta
        let boleta = formData.boleta;
        
        // Validar que la boleta tenga exactamente 10 dígitos
        if (boleta.length !== 10) {
            setModalMessage("La boleta debe tener exactamente 10 dígitos");
            setModalError(true);
            setModalOpen(true);
            return false;
        }
    
        // Validar que contenga "63" en la posición correcta (posiciones 5 y 6)
        if (boleta.slice(4, 6) !== "63") {
            setModalMessage("La boleta debe contener '63' en la posición correcta (formato: xxxx63xxxx)");
            setModalError(true);
            setModalOpen(true);
            return false;
        }
    
        // Validar que solo contenga números
        if (!/^\d+$/.test(boleta)) {
            setModalMessage("La boleta solo debe contener números");
            setModalError(true);
            setModalOpen(true);
            return false;
        }
    
        console.log('Validación de boleta:', {
            boleta,
            longitud: boleta.length,
            digitos63: boleta.slice(4, 6),
            esNumerica: /^\d+$/.test(boleta),
            esValida: true
        });
    
        // Validación de correo
        const emailPattern = /^[a-zA-Z0-9._%+-]+@alumno\.ipn\.mx$/;
        const isEmailValid = emailPattern.test(formData.email);
        if (!isEmailValid) {
            setModalMessage("El correo debe ser una cuenta institucional (@alumno.ipn.mx)");
            setModalError(true);
            setModalOpen(true);
            return false;
        }
    
        if (!formData.avisoPrivacidad) {
            setModalMessage("Debes aceptar el aviso de privacidad");
            setModalError(true);
            setModalOpen(true);
            return false;
        }
    
        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) return;

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const endpoint = formData.roles[0] === "conductor"
                ? 'http://localhost:8080/auth/nuevo/conductor'
                : 'http://localhost:8080/auth/nuevo/pasajero';

            const response = await axios.post(endpoint, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setModalMessage('Usuario registrado exitosamente');
            setModalError(false);
            setModalOpen(true);

             // Redirigir al usuario al login después de un registro exitoso
             setTimeout(() => {
                history.push('/login');
            }, 2000); // Espera 2 segundos para mostrar el mensaje antes de redirigir
            
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-center">Registro</h1>
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
                                placeholder="Ejemplo: 2020202020"
                                type="text" // Cambiado a text para mejor control
                                pattern="[0-9]*" // Solo permitir números
                                inputMode="numeric" // Teclado numérico en móviles
                                name="boleta"
                                value={formData.boleta}
                                onChange={handleChange}
                                maxLength="10"
                                required
                            />
                            <small className="text-gray-500 mt-1 block">
                                La boleta debe ser de 10 dígitos y contener '63' en la posición correcta (Ejemplo: 2020630962). 
                                Si eres alumno de cambio de carrera, contáctanos para validar tu caso.
                            </small>
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
                            <label className="text-lg font-medium">Género</label>
                            <select
                                className="w-full border-2 border-gray-100 rounded-md px-4 py-2 mt-2 bg-transparent"
                                name="sexo"
                                value={formData.sexo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona tu Género</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-lg font-medium">Foto o captura de tu credencial (validación de usuario)</label>
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
                                className="py-2 rounded-xl bg-pink-800 text-white font-bold hover:scale-105 transition-transform"
                            >
                                REGISTRAR
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
            {/* Modal de Aviso de Privacidad */}
            <PrivacyPolicyModal
                isOpen={showPrivacyModal}
                onAccept={handlePrivacyAccept}
                onDecline={handlePrivacyDecline}
            />
        </div>
    );
}

export default Register;
