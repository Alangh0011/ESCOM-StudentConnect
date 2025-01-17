import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
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
  const [error, setError] = useState('');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const originRef = useRef();
  const destinationRef = useRef();

  const ESCOM_DATA = {
    nombre: "ESCOM - Escuela Superior de Cómputo - IPN",
    lat: 19.5046493,
    lng: -99.146323,
    location: {
      lat: 19.5046493,
      lng: -99.146323
    }
  };

  const [formData, setFormData] = useState({
    nombreRuta: '',
    fechaProgramada: '',
    numeroPasajeros: 0,
    numeroParadas: '',
    costoGasolina: '',
    tipoRuta: '',
    horarioSalida: '',
    horarioLlegada: '',
    puntoInicioLat: null,
    puntoInicioLng: null,
    puntoFinalLat: null,
    puntoFinalLng: null,
    tiempo: '',
    distancia: '',
    puntoFinalNombre: '',
    puntoInicioNombre: '',
    estado: 'PENDIENTE'
  });
  // Modificar el handleTipoRutaChange
  const handleTipoRutaChange = (e) => {
    const tipo = e.target.value;
    
    // Limpiar los valores de origin y destination
    setOrigin(null);
    setDestination(null);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        tipoRuta: tipo,
        puntoInicioLat: null,
        puntoInicioLng: null,
        puntoFinalLat: null,
        puntoFinalLng: null,
        puntoInicioNombre: '',
        puntoFinalNombre: ''
      };
      
      if (tipo === 'C') {
        setDestination(ESCOM_DATA.location);
        return {
          ...newData,
          puntoFinalNombre: ESCOM_DATA.nombre,
          puntoFinalLat: ESCOM_DATA.lat,
          puntoFinalLng: ESCOM_DATA.lng
        };
      } else if (tipo === 'E') {
        setOrigin(ESCOM_DATA.location);
        return {
          ...newData,
          puntoInicioNombre: ESCOM_DATA.nombre,
          puntoInicioLat: ESCOM_DATA.lat,
          puntoInicioLng: ESCOM_DATA.lng
        };
      }
      
      return newData;
    });
  };

  const validarPuntoEscom = useCallback((puntoInicioNombre, puntoFinalNombre) => {
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
  }, []);

  const calculateRoute = useCallback(async () => {
    if (!window.google || !origin || !destination || !isLoaded) return;
    
    setIsCalculatingRoute(true);
    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const results = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK') {
              resolve(result);
            } else {
              reject(new Error(`Error al calcular la ruta: ${status}`));
            }
          }
        );
      });

      setDirectionsResponse(results);
      const time = results.routes[0].legs[0].duration.text;
      const dist = parseFloat(results.routes[0].legs[0].distance.text.replace(" km", "").replace(",", "."));

      setTravelTime(time);
      setDistance(dist);

      setFormData(prev => ({
        ...prev,
        tiempo: time,
        distancia: dist
      }));

    } catch (error) {
      console.error('Error al calcular la ruta:', error);
      setError('No se pudo calcular la ruta. Por favor, intente de nuevo.');
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [origin, destination, isLoaded]);

  // Modificar el handlePlaceChanged - esta es la versión correcta
const handlePlaceChanged = useCallback((ref, setLocationFunc) => {
  const place = ref.current?.getPlace();
  if (place?.geometry?.location && place?.formatted_address) {
    setError('');
    setLocationFunc(place.geometry.location);

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();
    const placeName = place.formatted_address;

    setFormData(prevData => ({
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
}, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validaciones
      const validacionEscom = validarPuntoEscom(formData.puntoInicioNombre, formData.puntoFinalNombre);
      if (!validacionEscom.esValido) {
        throw new Error("Uno de los puntos (inicio o destino) debe ser ESCOM");
      }

      if (formData.tipoRuta === "E" && !validacionEscom.inicioEsEscom) {
        throw new Error("Para rutas Escuela a Casa, el punto de inicio debe ser ESCOM");
      }

      if (formData.tipoRuta === "C" && !validacionEscom.finalEsEscom) {
        throw new Error("Para rutas Casa a Escuela, el punto de destino debe ser ESCOM");
      }

      const numeroParadasInt = parseInt(formData.numeroParadas, 10);
      if (isNaN(numeroParadasInt) || numeroParadasInt < 1 || numeroParadasInt > 4) {
        throw new Error("El número de paradas debe ser entre 1 y 4");
      }

      const horarioConcatenado = `${formData.horarioSalida} - ${formData.horarioLlegada}`;
      if (!formData.horarioSalida || !formData.horarioLlegada) {
        throw new Error("Los horarios son requeridos");
      }

      // Validar token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Sesión expirada. Por favor, inicie sesión de nuevo.");
      }

      // Formatear fecha
      const fechaFormateada = new Date(formData.fechaProgramada).toISOString().split('T')[0];

      const dataToSend = {
        conductor: { id: userId },
        nombreRuta: formData.nombreRuta,
        fechaProgramada: fechaFormateada,
        numeroPasajeros: formData.numeroPasajeros,
        numeroParadas: numeroParadasInt,
        costoGasolina: parseFloat(formData.costoGasolina),
        tipoRuta: formData.tipoRuta,
        horario: horarioConcatenado,
        puntoInicioLat: formData.puntoInicioLat,
        puntoInicioLng: formData.puntoInicioLng,
        puntoFinalLat: formData.puntoFinalLat,
        puntoFinalLng: formData.puntoFinalLng,
        puntoInicioNombre: formData.puntoInicioNombre,
        puntoFinalNombre: formData.puntoFinalNombre,
        tiempo: travelTime,
        distancia: distance,
        estado: formData.estado
      };

      const response = await axios.post(
        'https://studentconnect-backend.azurewebsites.net/api/rutas/nueva',
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRutaGuardada({
        ...response.data,
        numeroParadas: Number(response.data.numeroParadas)
      });

    } catch (error) {
      console.error("Error al crear la ruta:", error);
      setError(error.response?.data?.mensaje || error.message || "Error al crear la ruta");
    }
  };

  // Effect para calcular la ruta cuando cambien origin o destination
  useEffect(() => {
    if (origin && destination && isLoaded) {
      calculateRoute();
    }
  }, [origin, destination, isLoaded, calculateRoute]);

  if (loadError) return <div className="p-4">Error al cargar Google Maps</div>;
  if (!isLoaded) return <div className="p-4">Cargando mapa...</div>;

  const mapStyles = {
    height: "100%",
    width: "100%"
  };

  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 h-full p-4">
      <div className="w-full lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Registrar Nueva Ruta</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {!rutaGuardada ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Nombre de la Ruta */}
            <div>
              <label className="block font-medium">Nombre de la Ruta</label>
              <input
                type="text"
                value={formData.nombreRuta}
                onChange={(e) => setFormData(prev => ({ ...prev, nombreRuta: e.target.value }))}
                className="border rounded w-full p-2"
                placeholder="Ej. De Nezahuatcoyotl a ESCOM"
                required
              />
            </div>

            {/* Fecha de Viaje */}
            <div>
              <label className="block font-medium">Fecha de Viaje</label>
              <input
                type="date"
                value={formData.fechaProgramada}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaProgramada: e.target.value }))}
                className="border rounded w-full p-2"
                required
              />
            </div>

            {/* Tipo de Ruta */}
            <div>
              <label className="block font-medium">Tipo de Ruta</label>
              <select
                value={formData.tipoRuta}
                onChange={handleTipoRutaChange}
                className="border rounded w-full p-2"
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="C">Casa a Escuela</option>
                <option value="E">Escuela a Casa</option>
              </select>
            </div>

            {/* Punto de Inicio */}
            <div>
              <label className="block font-medium">Punto de Inicio</label>
              <Autocomplete
                onLoad={ref => { originRef.current = ref; }}
                onPlaceChanged={() => handlePlaceChanged(originRef, setOrigin)}
                options={{
                  componentRestrictions: { country: 'mx' },
                  fields: ['formatted_address', 'geometry']
                }}
              >
                <input 
                  type="text" 
                  value={formData.tipoRuta === 'E' ? ESCOM_DATA.nombre : formData.puntoInicioNombre}
                  placeholder={formData.tipoRuta === "E" ? "ESCOM" : "Ingresa dirección de inicio"}
                  className={`border rounded w-full p-2 ${formData.tipoRuta === 'E' ? 'bg-gray-100' : ''}`}
                  required
                  disabled={formData.tipoRuta === 'E'}
                  onChange={(e) => {
                    if (formData.tipoRuta !== 'E') {
                      setFormData(prev => ({
                        ...prev,
                        puntoInicioNombre: e.target.value
                      }));
                    }
                  }}
                />
              </Autocomplete>
              {formData.tipoRuta === "E" && (
                <small className="text-gray-500">Punto de inicio establecido como ESCOM</small>
              )}
            </div>

            {/* Punto de Destino */}
            <div>
              <label className="block font-medium">Punto de Destino</label>
              <Autocomplete
                onLoad={ref => { destinationRef.current = ref; }}
                onPlaceChanged={() => handlePlaceChanged(destinationRef, setDestination)}
                options={{
                  componentRestrictions: { country: 'mx' },
                  fields: ['formatted_address', 'geometry']
                }}
              >
                <input 
                  type="text" 
                  value={formData.tipoRuta === 'C' ? ESCOM_DATA.nombre : formData.puntoFinalNombre}
                  placeholder={formData.tipoRuta === "C" ? "ESCOM" : "Ingresa dirección de destino"}
                  className={`border rounded w-full p-2 ${formData.tipoRuta === 'C' ? 'bg-gray-100' : ''}`}
                  required
                  disabled={formData.tipoRuta === 'C'}
                  onChange={(e) => {
                    if (formData.tipoRuta !== 'C') {
                      setFormData(prev => ({
                        ...prev,
                        puntoFinalNombre: e.target.value
                      }));
                    }
                  }}
                />
              </Autocomplete>
              {formData.tipoRuta === "C" && (
                <small className="text-gray-500">Punto de destino establecido como ESCOM</small>
              )}
            </div>

            {/* Resto de campos del formulario */}
            <div>
              <label className="block font-medium">Número de Paradas (máximo 4)</label>
              <input
                type="number"
                value={formData.numeroParadas}
                onChange={(e) => setFormData(prev => ({ ...prev, numeroParadas: e.target.value }))}
                className="border rounded w-full p-2"
                min="1"
                max="4"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Gasto de gasolina por ruta</label>
              <input
                type="number"
                value={formData.costoGasolina}
                onChange={(e) => setFormData(prev => ({ ...prev, costoGasolina: e.target.value }))}
                className="border rounded w-full p-2"
                placeholder="Costo en pesos"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Horario de Salida</label>
              <input
                type="time"
                value={formData.horarioSalida}
                onChange={(e) => setFormData(prev => ({ ...prev, horarioSalida: e.target.value }))}
                className="border rounded w-full p-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Horario de Llegada</label>
              <input
                type="time"
                value={formData.horarioLlegada}
                onChange={(e) => setFormData(prev => ({ ...prev, horarioLlegada: e.target.value }))}
                className="border rounded w-full p-2"
                required
              />
            </div>

            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition-colors">
              Registrar Ruta
            </button>
          </form>
        ) : (
          rutaGuardada && rutaGuardada.numeroParadas ? (
            <ParadasControl rutaData={rutaGuardada} />
          ) : (
            <p>Cargando datos de la ruta...</p>
          )
        )}
      </div>

      {/* Mapa */}
      <div className="w-full lg:w-2/3 h-full lg:h-auto">
        <GoogleMap 
          mapContainerStyle={mapStyles} 
          zoom={13} 
          center={{ lat: 19.4326, lng: -99.1332 }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer 
              options={{ 
                directions: directionsResponse,
                suppressMarkers: false,
              }} 
            />
          )}
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

}

export default Ruta;