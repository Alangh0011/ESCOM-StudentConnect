import React from 'react';
import { Circle, Star, Clock, MapPin } from 'lucide-react';

const EstadoViaje = ({ viaje = {}, ubicacionConductor = null }) => {
  const {
    estado = 'PENDIENTE',
    calificacionConductor = 0,
    nombreConductor = 'No disponible',
    calificado = false
  } = viaje;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Circle className={`w-4 h-4 ${
            estado === 'EN_CURSO' ? 'text-green-500' : 
            estado === 'FINALIZADO' ? 'text-gray-500' : 
            'text-yellow-500'
          }`} />
          <span className="font-medium">Estado del Viaje: {estado}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {ubicacionConductor?.timestamp ? 
              new Date(ubicacionConductor.timestamp).toLocaleTimeString() : 
              'Sin actualizar'
            }
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Progreso del Viaje</span>
          </div>
          {ubicacionConductor ? (
            <div className="text-sm text-gray-600">
              <p>Lat: {ubicacionConductor.lat?.toFixed(6) ?? 'N/A'}</p>
              <p>Lng: {ubicacionConductor.lng?.toFixed(6) ?? 'N/A'}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Esperando actualización...</p>
          )}
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Conductor</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Calificación: {calificacionConductor.toFixed(1)}/5.0</p>
            <p>{nombreConductor}</p>
          </div>
        </div>
      </div>

      {estado === 'FINALIZADO' && !calificado && (
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-700 flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>No olvides calificar tu viaje</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default EstadoViaje;