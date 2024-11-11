// GoogleMapsContext.js
import React, { createContext } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const GoogleMapsContext = createContext();

// Incluye 'directions' en las bibliotecas
const libraries = ['places', 'directions'];

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const googleMaps = isLoaded ? window.google.maps : null;

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, googleMaps }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export default GoogleMapsContext;
