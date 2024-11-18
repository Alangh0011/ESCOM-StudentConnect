// GoogleMapsContext.js
import React, { createContext, useContext, useMemo } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const GoogleMapsContext = createContext(null);

// Incluye todas las bibliotecas que podrías necesitar
const libraries = ['places', 'directions', 'geometry'];

export const GoogleMapsProvider = ({ children }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    // Usar useMemo para evitar re-renders innecesarios
    const value = useMemo(() => ({
        isLoaded,
        loadError,
        googleMaps: isLoaded ? window.google.maps : null,
        // Agregar funciones de utilidad comunes
        createLatLng: (lat, lng) => {
            return isLoaded ? new window.google.maps.LatLng(lat, lng) : null;
        },
        createBounds: () => {
            return isLoaded ? new window.google.maps.LatLngBounds() : null;
        },
        // Agregar servicios comunes
        getDirectionsService: () => {
            return isLoaded ? new window.google.maps.DirectionsService() : null;
        },
        getGeocoder: () => {
            return isLoaded ? new window.google.maps.Geocoder() : null;
        }
    }), [isLoaded]);

    if (loadError) {
        return <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
            Error al cargar Google Maps: {loadError.message}
        </div>;
    }

    if (!isLoaded) {
        return <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
            Cargando Google Maps...
        </div>;
    }

    return (
        <GoogleMapsContext.Provider value={value}>
            {children}
        </GoogleMapsContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useGoogleMaps = () => {
    const context = useContext(GoogleMapsContext);
    if (context === null) {
        throw new Error('useGoogleMaps debe ser usado dentro de un GoogleMapsProvider');
    }
    return context;
};

export default GoogleMapsContext;