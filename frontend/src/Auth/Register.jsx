import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { useHistory } from 'react-router-dom';
import { Home, Eye, EyeOff } from 'lucide-react';

function Register() {
    const history = useHistory();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalError, setModalError] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        number: false,
        symbol: false
    });
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
        calificacion: 5,
        roles: ["pasajero"],
        placas: "",
        descripcion: "",
        modelo: "",
        color: ""
    });

    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setPasswordErrors({
            length: !hasMinLength,
            number: !hasNumber,
            symbol: !hasSymbol
        });

        return hasMinLength && hasNumber && hasSymbol;
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === 'fotoPerfil') {
            const file = files[0];
            if (file) {
                // Validar el tipo de archivo
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!validTypes.includes(file.type)) {
                    setModalMessage('Solo se permiten archivos PNG y JPG/JPEG');
                    setModalError(true);
                    setModalOpen(true);
                    // Limpiar el input de archivo
                    e.target.value = '';
                    return;
                }
                // Validar el tamaño del archivo (opcional, por ejemplo 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB en bytes
                if (file.size > maxSize) {
                    setModalMessage('El archivo es demasiado grande. El tamaño máximo es 5MB');
                    setModalError(true);
                    setModalOpen(true);
                    e.target.value = '';
                    return;
                }
            }
        }
        
        if (name === 'password') {
            validatePassword(value);
        }
        
        if (name === 'boleta') {
            const boletaValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({
                ...prev,
                [name]: boletaValue
            }));
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
        setShowPrivacyModal(false);
    };

    const handlePrivacyDecline = () => {
        setShowPrivacyModal(false);
        setFormData({ ...formData, avisoPrivacidad: false });
    };

    const validateFields = () => {
        // Validar contraseña primero
        if (!validatePassword(formData.password)) {
            setModalMessage('La contraseña debe tener al menos 8 caracteres, un número y un símbolo');
            setModalError(true);
            setModalOpen(true);
            return false;
        }

        let boleta = formData.boleta;
        
        if (boleta.length !== 10) {
            setModalMessage("La boleta debe tener exactamente 10 dígitos");
            setModalError(true);
            setModalOpen(true);
            return false;
        }
    
        if (boleta.slice(4, 6) !== "63") {
            setModalMessage("La boleta debe contener '63' en la posición correcta (formato: xxxx63xxxx)");
            setModalError(true);
            setModalOpen(true);
            return false;
        }
    
        if (!/^\d+$/.test(boleta)) {
            setModalMessage("La boleta solo debe contener números");
            setModalError(true);
            setModalOpen(true);
            return false;
        }
    
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
            
            formDataToSend.append('nombre', formData.nombre);
            formDataToSend.append('apellidoPaterno', formData.apellidoPaterno);
            formDataToSend.append('apellidoMaterno', formData.apellidoMaterno);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('boleta', formData.boleta);
            formDataToSend.append('calificacion', formData.calificacion);
            formDataToSend.append('avisoPrivacidad', formData.avisoPrivacidad);
            formDataToSend.append('sexo', formData.sexo);
    
            if (formData.fotoPerfil) {
                formDataToSend.append('fotoPerfil', formData.fotoPerfil);
            } else {
                setModalMessage('Debe seleccionar una foto de perfil');
                setModalError(true);
                setModalOpen(true);
                return;
            }
    
            if (formData.roles[0] === "conductor") {
                formDataToSend.append('placas', formData.placas);
                formDataToSend.append('descripcion', formData.descripcion);
                formDataToSend.append('modelo', formData.modelo);
                formDataToSend.append('color', formData.color);
            }
    
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
    
            setTimeout(() => {
                history.push('/login');
            }, 2000);
            
        } catch (error) {
            setModalMessage(error.response?.data?.message || 'Ocurrió un error inesperado');
            setModalError(true);
            setModalOpen(true);
        }
    };

    return (
        <>
          {/* Navbar */}
          <header className="fixed top-0 left-0 right-0 w-full bg-white transition-all duration-300 z-50 h-16 md:h-20">
                <div className="max-w-7xl mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">
                        <h1 className="text-xl md:text-2xl font-bold">
                            <Link to="/" className="no-underline text-black">
                                Student Connect
                                <span className="cursor-pointer text-primary">.</span>
                            </Link>
                        </h1>
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

            {/* Main Content */}
            <div className="min-h-screen flex items-center justify-center p-4 mt-20">
                <div className="w-full max-w-6xl flex flex-col-reverse md:flex-row shadow-2xl rounded-2xl overflow-hidden">
                    {/* Left Panel */}
                    <div className="w-full md:w-2/5 bg-secundary p-8 md:p-12 text-white flex flex-col justify-center relative min-h-[200px] md:min-h-0">
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-4">¿Ya tienes una cuenta?</h2>
                            <p className="text-white mb-6 md:mb-8 text-sm md:text-base">
                                ¡Bienvenido de vuelta! Inicia sesión para continuar tu viaje con nosotros.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block no-underline border border-white text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-primary hover:text-white active:bg-[#A92D6B] focus:bg-[#A92D6B] transition-colors duration-300 text-sm md:text-base touch-manipulation"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-900/30" />
                    </div>

                    {/* Right Panel - Form */}
                    <div className="w-full md:w-3/5 bg-tertiary p-8 md:p-12">
                        <div className="max-w-md mx-auto">
                            <h1 className="text-2xl md:text-3xl text-white font-semibold mb-8">Registro</h1>
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Basic Info Fields */}
                                {/* Basic Info Fields */}
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Nombre"
                                        className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="apellidoPaterno"
                                        value={formData.apellidoPaterno}
                                        onChange={handleChange}
                                        placeholder="Apellido Paterno"
                                        className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="apellidoMaterno"
                                        value={formData.apellidoMaterno}
                                        onChange={handleChange}
                                        placeholder="Apellido Materno"
                                        className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Correo institucional (@alumno.ipn.mx)"
                                        className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                        required
                                    />
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Contraseña"
                                            className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {/* Indicadores de requisitos de contraseña */}
                                    <div className="space-y-2 text-sm text-white">
                                        <p className={`flex items-center gap-2 ${passwordErrors.length ? 'text-red-500' : 'text-green-500'}`}>
                                            {passwordErrors.length ? '✗' : '✓'} Mínimo 8 caracteres
                                        </p>
                                        <p className={`flex items-center gap-2 ${passwordErrors.number ? 'text-red-500' : 'text-green-500'}`}>
                                            {passwordErrors.number ? '✗' : '✓'} Al menos un número
                                        </p>
                                        <p className={`flex items-center gap-2 ${passwordErrors.symbol ? 'text-red-500' : 'text-green-500'}`}>
                                            {passwordErrors.symbol ? '✗' : '✓'} Al menos un símbolo (!@#$%^&*(),.?":{}|&lt;&gt;)
                                        </p>
                                    </div>

                                    <input
                                        type="text"
                                        name="boleta"
                                        value={formData.boleta}
                                        onChange={handleChange}
                                        placeholder="Boleta (Ejemplo: 2020630962)"
                                        className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                        maxLength="10"
                                        required
                                    />
                                    <select
                                        name="sexo"
                                        value={formData.sexo}
                                        onChange={handleChange}
                                        className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base bg-white"
                                        required
                                    >
                                        <option value="">Selecciona tu Género</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="femenino">Femenino</option>
                                    </select>

                                    <div className="space-y-2">
                                        <label className="text-white text-sm">Foto de Credencial</label>
                                        <input
                                            type="file"
                                            name="fotoPerfil"
                                            onChange={handleChange}
                                            className="w-full text-white text-sm p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-2">
                                    <label className="text-white text-sm block mb-2">Tipo de Usuario</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center space-x-2 text-white">
                                            <input
                                                type="radio"
                                                name="rol"
                                                value="pasajero"
                                                checked={formData.roles[0] === "pasajero"}
                                                onChange={handleRoleChange}
                                                className="form-radio"
                                            />
                                            <span>Pasajero</span>
                                        </label>
                                        <label className="flex items-center space-x-2 text-white">
                                            <input
                                                type="radio"
                                                name="rol"
                                                value="conductor"
                                                checked={formData.roles[0] === "conductor"}
                                                onChange={handleRoleChange}
                                                className="form-radio"
                                            />
                                            <span>Conductor</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Conductor Fields */}
                                {formData.roles[0] === "conductor" && (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="placas"
                                            value={formData.placas}
                                            onChange={handleChange}
                                            placeholder="Placas del vehículo"
                                            className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            placeholder="Descripción del vehículo"
                                            className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="modelo"
                                            value={formData.modelo}
                                            onChange={handleChange}
                                            placeholder="Modelo del vehículo"
                                            className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="color"
                                            value={formData.color}
                                            onChange={handleChange}
                                            placeholder="Color del vehículo"
                                            className="w-full rounded px-4 py-3 border-b border-gray-300 focus:border-[#ff7c7c] outline-none transition-colors text-sm md:text-base"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Privacy Policy Checkbox */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="avisoPrivacidad"
                                        checked={formData.avisoPrivacidad}
                                        onChange={handleChange}
                                        className="form-checkbox"
                                        required
                                    />
                                    <label className="text-white text-sm">
                                        Acepto el Aviso de Privacidad
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-tertiary border border-white text-white px-6 py-3 rounded-lg hover:bg-[#A92D6B] active:bg-[#8B1B4D] focus:bg-[#A92D6B] transition-colors duration-300 text-sm md:text-base touch-manipulation"
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <Modal 
                    isOpen={modalOpen} 
                    onClose={() => setModalOpen(false)} 
                    data={{ error: modalError, message: modalMessage }} 
                />
                <PrivacyPolicyModal
                    isOpen={showPrivacyModal}
                    onAccept={handlePrivacyAccept}
                    onDecline={handlePrivacyDecline}
                />
            </div>
        </>
    );
}

export default Register;