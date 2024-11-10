// GoogleMapsContext.js
import React, { createContext } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const GoogleMapsContext = createContext();

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });

  // Accede a `window.google.maps` solo si `isLoaded` es verdadero
  const googleMaps = isLoaded ? window.google.maps : null;

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, googleMaps }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export default GoogleMapsContext;
