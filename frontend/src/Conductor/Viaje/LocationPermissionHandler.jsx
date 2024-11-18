import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const LocationPermissionHandler = ({ onLocationGranted }) => {
    const [permissionStatus, setPermissionStatus] = useState(null);
    const [hasSuccess, setHasSuccess] = useState(false);

    const startLocationTracking = async () => {
        // Si ya tuvimos éxito, no intentamos de nuevo
        if (hasSuccess) return;

        try {
            // Primero verificamos el permiso
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            setPermissionStatus(permission.state);

            if (permission.state === 'denied') {
                toast.error('Por favor permite el acceso a tu ubicación en la configuración de tu navegador');
                return;
            }

            // Obtenemos la ubicación
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const ubicacion = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('Ubicación obtenida:', ubicacion);
                    setPermissionStatus('granted');
                    setHasSuccess(true);
                    onLocationGranted(ubicacion);
                    toast.success('Ubicación activada correctamente');
                },
                (error) => {
                    console.error('Error al obtener ubicación:', error);
                    switch(error.code) {
                        case 1: // PERMISSION_DENIED
                            setPermissionStatus('denied');
                            toast.error('Permite el acceso a tu ubicación en la configuración del navegador');
                            break;
                        case 2: // POSITION_UNAVAILABLE
                            toast.error('No se pudo obtener la ubicación actual');
                            break;
                        case 3: // TIMEOUT
                            toast.error('Tiempo de espera agotado al obtener ubicación');
                            break;
                        default:
                            toast.error('Error al obtener la ubicación');
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            toast.error('Error al verificar permisos de ubicación');
        }
    };

    useEffect(() => {
        startLocationTracking();
    }, []);

    return (
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2">
                    <MapPin className={`w-6 h-6 ${
                        hasSuccess ? 'text-green-500' :
                        permissionStatus === 'denied' ? 'text-red-500' :
                        'text-yellow-500'
                    }`} />
                    <span className="font-medium">
                        {hasSuccess ? 'Ubicación activada' :
                         permissionStatus === 'denied' ? 'Ubicación denegada' :
                         'Esperando permiso'}
                    </span>
                </div>

                {permissionStatus === 'denied' && (
                    <div className="text-center">
                        <p className="text-red-500 mb-2 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Acceso a ubicación denegado
                        </p>
                        <p className="text-sm text-gray-600">
                            Por favor, permite el acceso a tu ubicación en la configuración 
                            del navegador y luego actualiza la página.
                        </p>
                    </div>
                )}

                {!hasSuccess && permissionStatus !== 'denied' && (
                    <button
                        onClick={startLocationTracking}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Activar ubicación
                    </button>
                )}
            </div>
        </div>
    );
};

export default LocationPermissionHandler;