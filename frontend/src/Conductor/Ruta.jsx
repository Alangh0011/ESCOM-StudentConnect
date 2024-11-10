import { useState, useRef, useEffect, useContext } from 'react';
import { GoogleMap, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import GoogleMapsContext from '../GoogleMapsContext';
import ParadasControl from './ParadasControl';
import TimePicker from 'react-time-picker';


const Ruta = ({ userId }) => {
  const { isLoaded, loadError } = useContext(GoogleMapsContext);
  const [rutaGuardada, setRutaGuardada] = useState(null); // Estado para la ruta guardada
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [travelTime, setTravelTime] = useState('');
  const [distance, setDistance] = useState('');
  const [formData, setFormData] = useState({
    nombreRuta: '',
    fechaPublicacion: '',
    numeroPasajeros: 0,
    numeroParadas: '',
    costoGasolina: '',
    tipoRuta: '',
    horario: '',
    puntoInicioLat: null,
    puntoInicioLng: null,
    puntoFinalLat: null,
    puntoFinalLng: null,
    costoTotalGasolina: '',
    tiempo: '',
    distancia: '',
    puntoFinalNombre: '',
    puntoInicioNombre: ''
  });
  const [error, setError] = useState('');
  const originRef = useRef();
  const destinationRef = useRef();

  if (loadError) return <p>Error al cargar Google Maps</p>;
  if (!isLoaded) return <p>Cargando mapa...</p>;

  const handlePlaceChanged = (ref, setLocation, setLat, setLng) => {
    const place = ref.current.getPlace();
    if (place && place.geometry && place.geometry.location) {
        setError('');
        setLocation(place.geometry.location);

        // Obtener latitud y longitud
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        // Obtener el nombre del lugar
        const placeName = place.name || place.formatted_address || '';

        // Asignar latitud, longitud y nombre al formData
        setFormData((prevData) => ({
            ...prevData,
            puntoInicioLat: ref === originRef ? latitude : prevData.puntoInicioLat,
            puntoInicioLng: ref === originRef ? longitude : prevData.puntoInicioLng,
            puntoFinalLat: ref === destinationRef ? latitude : prevData.puntoFinalLat,
            puntoFinalLng: ref === destinationRef ? longitude : prevData.puntoFinalLng,
            puntoInicioNombre: ref === originRef ? placeName : prevData.puntoInicioNombre,
            puntoFinalNombre: ref === destinationRef ? placeName : prevData.puntoFinalNombre
        }));
    } else {
        console.error("No se pudieron obtener las coordenadas del lugar.");
        setError("Error al obtener la ubicación");
    }
};


  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (
      !originRef.current.getPlace().name.includes("ESCOM") &&
      !destinationRef.current.getPlace().name.includes("ESCOM") &&
      !originRef.current.getPlace().name.includes("Escuela Superior de Cómputo") &&
      !destinationRef.current.getPlace().name.includes("Escuela Superior de Cómputo")
      ) {
          setError("El punto de inicio o destino debe incluir 'ESCOM' o 'Escuela Superior de Cómputo'.");
          return;
    }

    // Concatenar horario antes de enviarlo
    const horarioConcatenado = `${formData.horarioSalida} - ${formData.horarioLlegada}`;
    
    // Verificar si el horario está en el formato correcto
    if (horarioConcatenado === "00:00 - 00:00") {
        setError("El horario no puede estar en 00:00 - 00:00.");
        return;
    }
     // Validación del número de paradas
     if (formData.numeroParadas < 1 || formData.numeroParadas > 4) {
      setError("El número de paradas debe estar entre 1 y 4.");
      return;
  }

    if (!origin || !destination || formData.numeroParadas > 4) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }
    // Verificar que todos los campos necesarios están presentes
    if (!formData.puntoInicioLat || !formData.puntoInicioLng || !formData.puntoFinalLat || !formData.puntoFinalLng || !travelTime || !distance) {
      setError("Datos incompletos. Asegúrate de seleccionar correctamente los puntos de inicio y destino.");
      console.log("Datos actuales:", formData, travelTime, distance);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("El token no está disponible. Por favor, inicie sesión de nuevo.");
        console.error("Error: Token no encontrado en el almacenamiento local.");
        return;
      }

      // Actualizar formData con tiempo y distancia antes de enviarlo
      const dataToSend = {
        ...formData,
        horario: horarioConcatenado, // Aseguramos que el horario concatenado se envía
        tiempo: travelTime,
        distancia: distance
      };

      console.log("Enviando datos a backend:", {
        conductor: { id: userId },
        ...dataToSend
      });

      const response = await axios.post(
        'http://localhost:8080/api/rutas/nueva',
        {
          conductor: { id: userId },
          ...dataToSend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );  
      setRutaGuardada(response.data); // Guardamos la respuesta en estado para luego pasarla a ParadasControl
    } catch (error) {
      console.error("Error al crear la ruta:", error);
      setError("Error al crear la ruta. Por favor, revisa los datos ingresados.");
    }
  };
  useEffect(() => {
    console.log("Datos de formData antes de enviar a ParadasControl:", formData);
  }, [formData]);


  const calculateRoute = () => {
    if (!origin || !destination) return;
    const directionsService = new window.google.maps.DirectionsService();
  
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirectionsResponse(result);
          const time = result.routes[0].legs[0].duration.text;
          const dist = result.routes[0].legs[0].distance.text;
          setTravelTime(time);
          setDistance(dist);
  
          // Actualizar formData directamente
          setFormData((prevData) => ({
            ...prevData,
            tiempo: time,
            distancia: dist,
            puntoInicioLat: origin.lat(),
            puntoInicioLng: origin.lng(),
            puntoFinalLat: destination.lat(),
            puntoFinalLng: destination.lng(),
          }));
        } else {
          console.error(`Error al obtener la ruta: ${status}`);
        }
      }
    );
  };
  

  useEffect(() => {
    if (origin && destination) calculateRoute();
  }, [origin, destination]);

  const mapStyles = {
    height: "100%",
    width: "100%"
  };

  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 h-full p-4">
      <div className="w-full lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Registrar Nueva Ruta</h2>
        {error && <p className="text-red-500">{error}</p>}
        {!rutaGuardada ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Nombre de la Ruta</label>
              <input
                type="text"
                value={formData.nombreRuta}
                onChange={(e) => setFormData({ ...formData, nombreRuta: e.target.value })}
                className="border rounded w-full p-2"
                placeholder="Ej. De Nezahuatcoyotl a ESCOM"
              />
            </div>
            <div>
              <label className="block font-medium">Fecha de Viaje</label>
              <input
                type="date"
                value={formData.fechaPublicacion}
                onChange={(e) => setFormData({ ...formData, fechaPublicacion: e.target.value })}
                className="border rounded w-full p-2"
              />
            </div>
            <div>
              <label className="block font-medium">Punto de Inicio</label>
              <Autocomplete
                onLoad={(ref) => (originRef.current = ref)}
                onPlaceChanged={() => handlePlaceChanged(originRef, setOrigin, (lat) => setFormData({ ...formData, puntoInicioLat: lat }), (lng) => setFormData({ ...formData, puntoInicioLng: lng }))}
              >
                <input type="text" placeholder="Ingresa dirección de inicio" className="border rounded w-full p-2" />
              </Autocomplete>
            </div>
            <div>
              <label className="block font-medium">Punto de Destino</label>
              <Autocomplete
                onLoad={(ref) => (destinationRef.current = ref)}
                onPlaceChanged={() => handlePlaceChanged(destinationRef, setDestination, (lat) => setFormData({ ...formData, puntoFinalLat: lat }), (lng) => setFormData({ ...formData, puntoFinalLng: lng }))}
              >
                <input type="text" placeholder="Ingresa dirección de destino" className="border rounded w-full p-2" />
              </Autocomplete>
            </div>
            <div>
              <label className="block font-medium">Número de Paradas (máximo 4)</label>
              <input
                type="number"
                value={formData.numeroParadas}
                onChange={(e) => setFormData({ ...formData, numeroParadas: e.target.value })}
                className="border rounded w-full p-2"
                min="1"
                max="4"
              />
            </div>
            <div>
              <label className="block font-medium">Tipo de Ruta</label>
              <select
                value={formData.tipoRuta}
                onChange={(e) => setFormData({ ...formData, tipoRuta: e.target.value })}
                className="border rounded w-full p-2"
              >
                <option value="">Seleccione una opción</option>
                <option value="C">Casa a Escuela</option>
                <option value="E">Escuela a Casa</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Gasto de gasolina por ruta</label>
              <input
                type="number"
                value={formData.costoGasolina}
                onChange={(e) => setFormData({ ...formData, costoGasolina: e.target.value })}
                className="border rounded w-full p-2"
                placeholder="Costo en pesos"
              />
            </div>
            <div>
            <TimePicker
                onChange={(value) => setFormData(prevData => ({ ...prevData, horarioSalida: value }))}
                value={formData.horarioSalida}
                className="border rounded w-full p-2"
            />
            <TimePicker
                onChange={(value) => setFormData(prevData => ({ ...prevData, horarioLlegada: value }))}
                value={formData.horarioLlegada}
                className="border rounded w-full p-2"
            />

            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Registrar Ruta</button>
          </form>
        ) : (
          <ParadasControl rutaData={rutaGuardada} /> // Carga ParadasControl con los datos de la ruta
        )}
      </div>
      <div className="w-full lg:w-2/3 h-full lg:h-auto">
        <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={{ lat: 19.4326, lng: -99.1332 }}>
          {directionsResponse && <DirectionsRenderer options={{ directions: directionsResponse }} />}
        </GoogleMap>
        <div className="mt-4">
          {formData.tiempo && formData.distancia ? (
            <p className="text-green-500 font-semibold mb-4">Ruta calculada. Listo para registrar.</p>
          ) : (
            <p className="text-red-500 font-semibold mb-4">Calculando la ruta...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ruta;
