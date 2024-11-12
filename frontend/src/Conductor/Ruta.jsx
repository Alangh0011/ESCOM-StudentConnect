import { useState, useRef, useEffect, useContext } from 'react';
import { GoogleMap, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import axios from 'axios';
import GoogleMapsContext from '../GoogleMapsContext';
import ParadasControl from './ParadasControl';

const Ruta = ({ userId }) => {
  const { isLoaded, loadError } = useContext(GoogleMapsContext);
  const [rutaGuardada, setRutaGuardada] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [travelTime, setTravelTime] = useState('');
  const [distance, setDistance] = useState('');
  const [formData, setFormData] = useState({
    nombreRuta: '',
    fechaPublicacion: '',
    numeroPasajeros: 0,
    numeroParadas: '', // Cambiarlo a número más adelante
    costoGasolina: '',
    tipoRuta: '',
    horario: '',
    puntoInicioLat: null,
    puntoInicioLng: null,
    puntoFinalLat: null,
    puntoFinalLng: null,
    tiempo: '',
    distancia: '',
    puntoFinalNombre: '',
    puntoInicioNombre: ''
  });
  const [error, setError] = useState('');
  const originRef = useRef();
  const destinationRef = useRef();
  const validarPuntoEscom = (puntoInicioNombre, puntoFinalNombre) => {
  const nombresEscomValidos = [
    "ESCOM",
    "Escuela Superior de Cómputo",
    "ESCOM - Escuela Superior de Cómputo",
    "Escuela Superior de Computo",
    "ESCOM IPN",
    "Escuela Superior de Cómputo IPN"
  ].map(nombre => nombre.toLowerCase());

  const inicioEsEscom = nombresEscomValidos.some(nombre => 
    puntoInicioNombre?.toLowerCase().includes(nombre)
  );
  
  const finalEsEscom = nombresEscomValidos.some(nombre => 
    puntoFinalNombre?.toLowerCase().includes(nombre)
  );

  return {
    esValido: inicioEsEscom || finalEsEscom,
    inicioEsEscom,
    finalEsEscom
  };
};


  if (loadError) return <p>Error al cargar Google Maps</p>;
  if (!isLoaded) return <p>Cargando mapa...</p>;

  const handlePlaceChanged = (ref, setLocation, setLat, setLng) => {
    const place = ref.current.getPlace();
    if (place && place.geometry && place.geometry.location) {
      setError('');
      setLocation(place.geometry.location);

      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      const placeName = place.name || place.formatted_address || '';

      // Actualizar el formData
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        puntoInicioLat: ref === originRef ? latitude : prevData.puntoInicioLat,
        puntoInicioLng: ref === originRef ? longitude : prevData.puntoInicioLng,
        puntoFinalLat: ref === destinationRef ? latitude : prevData.puntoFinalLat,
        puntoFinalLng: ref === destinationRef ? longitude : prevData.puntoFinalLng,
        puntoInicioNombre: ref === originRef ? placeName : prevData.puntoInicioNombre,
        puntoFinalNombre: ref === destinationRef ? placeName : prevData.puntoFinalNombre
      };

      // Validar la selección después de actualizar
      const validacion = validarPuntoEscom(
        ref === originRef ? placeName : prevData.puntoInicioNombre,
        ref === destinationRef ? placeName : prevData.puntoFinalNombre
      );

      if (!validacion.esValido) {
        setError("Recuerda: Uno de los puntos debe ser ESCOM");
      }

      return newData;
    });
  } else {
    console.error("No se pudieron obtener las coordenadas del lugar.");
    setError("Error al obtener la ubicación");
  }
};

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const validacionEscom = validarPuntoEscom(formData.puntoInicioNombre, formData.puntoFinalNombre);

    if (!validacionEscom.esValido) {
      setError("Uno de los puntos (inicio o destino) debe ser ESCOM");
      return;
    }
    // Validar que el tipo de ruta coincida con la dirección de ESCOM
  if (formData.tipoRuta === "E" && !validacionEscom.inicioEsEscom) {
    setError("Para rutas Escuela a Casa, el punto de inicio debe ser ESCOM");
    return;
  }

  if (formData.tipoRuta === "C" && !validacionEscom.finalEsEscom) {
    setError("Para rutas Casa a Escuela, el punto de destino debe ser ESCOM");
    return;
  }

  if (!origin || !destination || !formData.numeroParadas || formData.numeroParadas < 1 || formData.numeroParadas > 4) {
    setError("Por favor, completa todos los campos requeridos y asegúrate de que el número de paradas esté entre 1 y 4.");
    return;
  }

    if (!origin || !destination || !formData.numeroParadas || formData.numeroParadas < 1 || formData.numeroParadas > 4) {
      setError("Por favor, completa todos los campos requeridos y asegúrate de que el número de paradas esté entre 1 y 4.");
      return;
    }

    const numeroParadasInt = parseInt(formData.numeroParadas, 10);
    if (isNaN(numeroParadasInt)) {
      setError("El número de paradas debe ser un valor numérico.");
      return;
    }

    const horarioConcatenado = `${formData.horarioSalida} - ${formData.horarioLlegada}`;
    if (horarioConcatenado === "00:00 - 00:00") {
      setError("El horario no puede estar en 00:00 - 00:00.");
      return;
    }

    const dataToSend = {
      ...formData,
      numeroParadas: numeroParadasInt,
      horario: horarioConcatenado,
      tiempo: travelTime,
      distancia: distance,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("El token no está disponible. Por favor, inicie sesión de nuevo.");
        return;
      }

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

      const rutaData = { ...response.data, numeroParadas: Number(response.data.numeroParadas) };
      setRutaGuardada(rutaData);
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
          const dist = parseFloat(result.routes[0].legs[0].distance.text.replace(" km", "").replace(",", "."));
  
          setTravelTime(time);
          setDistance(dist);

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
                onPlaceChanged={() => handlePlaceChanged(originRef, setOrigin)}
              >
                <input 
                    type="text" 
                    placeholder={formData.tipoRuta === "E" ? "Debe ser ESCOM" : "Ingresa dirección de inicio"} 
                    className="border rounded w-full p-2" 
                  />
                </Autocomplete>
                {formData.tipoRuta === "E" && (
                  <small className="text-gray-500">Para rutas Escuela a Casa, el punto de inicio debe ser ESCOM</small>
                )}
            </div>
            <div>
              <label className="block font-medium">Punto de Destino</label>
              <Autocomplete
                onLoad={(ref) => (destinationRef.current = ref)}
                onPlaceChanged={() => handlePlaceChanged(destinationRef, setDestination)}
              >
              <input 
                  type="text" 
                  placeholder={formData.tipoRuta === "C" ? "Debe ser ESCOM" : "Ingresa dirección de destino"} 
                  className="border rounded w-full p-2" 
                />
              </Autocomplete>
              {formData.tipoRuta === "C" && (
                <small className="text-gray-500">Para rutas Casa a Escuela, el punto de destino debe ser ESCOM</small>
              )}
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
  <label className="block font-medium">Horario de Salida</label>
  <input
    type="time"
    value={formData.horarioSalida}
    onChange={(e) => setFormData(prevData => ({ ...prevData, horarioSalida: e.target.value }))}
    className="border rounded w-full p-2 text-lg text-gray-800"
  />
</div>
<div>
  <label className="block font-medium">Horario de Llegada</label>
  <input
    type="time"
    value={formData.horarioLlegada}
    onChange={(e) => setFormData(prevData => ({ ...prevData, horarioLlegada: e.target.value }))}
    className="border rounded w-full p-2 text-lg text-gray-800"
  />
</div>


            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Registrar Ruta</button>
          </form>
        ) : (
          rutaGuardada && rutaGuardada.numeroParadas ? (
            <>
              {console.log("rutaGuardada en Ruta.jsx antes de renderizar ParadasControl:", rutaGuardada)}
              <ParadasControl rutaData={rutaGuardada} />
            </>
          ) : (
            <p>Cargando datos de la ruta...</p>
          )
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