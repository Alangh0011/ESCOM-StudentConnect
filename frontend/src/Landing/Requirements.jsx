import React, { useState, useEffect } from 'react';

const RequirementCard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const touchDevice = ('ontouchstart' in window) || 
      (navigator.maxTouchPoints > 0) || 
      (navigator.msMaxTouchPoints > 0);
    setIsTouchDevice(touchDevice);
  }, []);

  const handleInteraction = () => {
    if (isTouchDevice) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className="relative w-full h-[150px] sm:h-[120px] perspective-1000 group"
      onMouseEnter={() => !isTouchDevice && setIsFlipped(true)}
      onMouseLeave={() => !isTouchDevice && setIsFlipped(false)}
      onClick={handleInteraction}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleInteraction();
        }
      }}
    >
      <div
        className={`absolute w-full h-full transition-transform duration-1000 ease-in-out transform-style-3d 
          ${isFlipped ? 'rotate-y-180' : ''} 
          ${isTouchDevice ? 'cursor-pointer active:scale-95' : 'hover:shadow-lg'}
        `}
      >
        {/* Frente de la tarjeta */}
        <div className="absolute w-full h-full backface-hidden rounded-xl p-3 sm:p-4 bg-white flex items-center justify-center shadow-md">
          <p className="text-xs sm:text-sm text-black-700 text-center font-medium">{front}</p>
          {isTouchDevice && (
            <div className="absolute bottom-2 right-2 text-[10px] text-gray-400">
              Toca para más info
            </div>
          )}
        </div>

        {/* Reverso de la tarjeta */}
        <div className="absolute w-full h-full backface-hidden rounded-xl p-3 sm:p-4 bg-pink-100 rotate-y-180 flex items-center justify-center shadow-md">
          {Array.isArray(back) ? (
            <ul className="list-disc text-xs sm:text-sm text-gray-700 space-y-0.5 pl-4">
              {back.map((item, index) => (
                <li key={index} className="text-left">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-gray-700 text-center">{back}</p>
          )}
          {isTouchDevice && (
            <div className="absolute bottom-2 right-2 text-[10px] text-gray-400">
              Toca para volver
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Requirements = () => {
  const conductorRequirements = [
    {
      front: "Ser estudiante activo de la ESCOM",
      back: [
        "Credencial vigente del IPN",
        "Correo institucional activo",
        "Boleta actual"
      ]
    },
    {
      front: "Documentos del vehículo en regla",
      back: [
        "Tarjeta de circulación vigente",
        "Verificación actualizada",
        "Seguro del auto vigente"
      ]
    },
    {
      front: "Aceptar términos y condiciones",
      back: [
        "Política de privacidad",
        "Términos del servicio",
        "Normas de la comunidad"
      ]
    },
    {
      front: "Seguir protocolo de seguridad",
      back: [
        "Respetar señales de tránsito",
        "Mantener límites de velocidad",
        "Seguir rutas establecidas"
      ]
    }
  ];

  const pasajeroRequirements = [
    {
      front: "Ser estudiante activo de la ESCOM",
      back: [
        "Credencial vigente del IPN",
        "Correo institucional activo",
        "Boleta actual"
      ]
    },
    {
      front: "Correo institucional validado",
      back: [
        "Dominio @alumno.ipn.mx",
        "Verificación por código",
        "Datos completos"
      ]
    },
    {
      front: "Aceptar términos y condiciones",
      back: [
        "Política de privacidad",
        "Términos del servicio",
        "Normas de la comunidad"
      ]
    },
    {
      front: "Seguir protocolo de seguridad",
      back: [
        "Puntualidad en paradas",
        "Respetar horarios",
        "Mantener conducta apropiada"
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-8">
      <h2 className="text-2xl sm:text-4xl text-secundary font-bold text-center mb-6 sm:mb-10">Requisitos</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Sección Conductor */}
        <div className="rounded-xl bg-tertiary p-6 sm:p-8 shadow-lg">
          <h3 className="text-lg sm:text-xl text-white font-semibold mb-4 sm:mb-6">Conductor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {conductorRequirements.map((req, index) => (
              <RequirementCard 
                key={`conductor-${index}`}
                front={req.front}
                back={req.back}
              />
            ))}
          </div>
        </div>

        {/* Sección Pasajero */}
        <div className="rounded-xl bg-tertiary p-6 sm:p-8 shadow-lg">
          <h3 className="text-lg sm:text-xl text-white font-semibold mb-4 sm:mb-6">Pasajero</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {pasajeroRequirements.map((req, index) => (
              <RequirementCard 
                key={`pasajero-${index}`}
                front={req.front}
                back={req.back}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requirements;