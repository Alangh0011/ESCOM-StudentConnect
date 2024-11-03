import { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Ruta = ({ userId }) => {
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
    distancia: ''
  });
  const [error, setError] = useState('');
  const originRef = useRef();
  const destinationRef = useRef();

  const history = useHistory();

  const validatePoints = (place) => {
    const placeName = place.formatted_address || '';
    return placeName.toLowerCase().includes("escom") || placeName.toLowerCase().includes("escuela superior de cómputo");
  };

  const handlePlaceChanged = (ref, setLocation, setLat, setLng) => {
    const place = ref.current.getPlace();
    if (place.geometry) {
        setError('');
        setLocation(place.geometry.location);
        
        // Asignar latitud y longitud al formData
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        setLat(latitude);
        setLng(longitude);

        // Guardar en formData
        setFormData((prevData) => ({
            ...prevData,
            puntoInicioLat: ref === originRef ? latitude : prevData.puntoInicioLat,
            puntoInicioLng: ref === originRef ? longitude : prevData.puntoInicioLng,
            puntoFinalLat: ref === destinationRef ? latitude : prevData.puntoFinalLat,
            puntoFinalLng: ref === destinationRef ? longitude : prevData.puntoFinalLng
        }));
    } else {
        setError("Error al obtener la ubicación");
    }
};


const handleFormSubmit = async (event) => {
  event.preventDefault();

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
          tiempo: travelTime,
          distancia: distance
      };

      console.log("Enviando datos a backend:", {
          conductor: { id: userId },
          ...dataToSend
      });

      await axios.post(
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

      history.push('/home');
  } catch (error) {
      console.error("Error al crear la ruta:", error);
      setError("Error al crear la ruta. Por favor, revisa los datos ingresados.");
  }
};



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

        // Actualizar tiempo y distancia en formData
        setFormData((prevData) => ({
            ...prevData,
            tiempo: time,
            distancia: dist
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
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 h-full p-4">
        <div className="w-full lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Registrar Nueva Ruta</h2>
          {error && <p className="text-red-500">{error}</p>}
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
              <label className="block font-medium">Fecha de Publicación</label>
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
              <label className="block font-medium">Costo Total de Gasolina</label>
              <input
                type="number"
                value={formData.costoGasolina}
                onChange={(e) => setFormData({ ...formData, costoGasolina: e.target.value })}
                className="border rounded w-full p-2"
                placeholder="Costo en pesos"
              />
            </div>
            <div>
              <label className="block font-medium">Horario</label>
              <input
                type="text"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="border rounded w-full p-2"
                placeholder="Ej. 7:00 AM - 8:00 AM"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Registrar Ruta</button>
          </form>
        </div>
        <div className="w-full lg:w-2/3 h-full lg:h-auto">
          <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={{ lat: 19.4326, lng: -99.1332 }}>
            {directionsResponse && <DirectionsRenderer options={{ directions: directionsResponse }} />}
          </GoogleMap>
          <div className="mt-4">
          {formData.tiempo && <p>Tiempo estimado: {formData.tiempo}</p>}
          {formData.distancia && <p>Distancia: {formData.distancia}</p>}
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default Ruta;
