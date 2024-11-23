import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQItem = ({ pregunta, respuesta }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 last:border-none">
      <button
        className="w-full flex justify-between items-center py-4 hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-left text-gray-800">{pregunta}</span>
        <span className="text-primary text-xl font-bold">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="py-4 bg-gray-50">
          <p className="text-gray-800 text-justify">{respuesta}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const preguntas = [
    {
      id: 1,
      pregunta: "¿Qué es Student Connect?",
      respuesta: "Student Connect es una plataforma web diseñada específicamente para estudiantes de la ESCOM que busca conectar a estudiantes conductores con pasajeros para compartir viajes de manera segura y económica. La plataforma promueve la interacción estudiantil y ofrece una alternativa de transporte para la comunidad ESCOM.",
    },
    {
      id: 2,
      pregunta: "¿Cómo puedo registrarme en la plataforma?",
      respuesta: "El registro es sencillo: solo necesitas tu correo institucional universitario y completar un formulario básico con tus datos académicos. Verificaremos tu información y activaremos tu cuenta.",
    },
    {
      id: 3,
      pregunta: "¿Qué beneficios obtengo al unirme?",
      respuesta: "Como miembro de Student Connect, tendrás acceso a una red segura de transporte compartido exclusiva para estudiantes verificados de la ESCOM, lo que te permite compartir gastos de viaje y hacer más eficiente tu traslado diario. La plataforma mejora significativamente la movilidad estudiantil al conectarte con compañeros que tienen rutas similares, y te permite acceder a un sistema organizado de rutas y horarios planificados semanalmente, facilitando la coordinación de tus viajes hacia y desde la escuela.",
    },
    {
      id: 4,
      pregunta: "¿La plataforma es gratuita?",
      respuesta: "La plataforma es gratuita para registrarse y usar. Los costos asociados son únicamente los del viaje compartido, que se calculan de manera proporcional según la distancia recorrida y las paradas seleccionadas.",
    },
    {
      id: 5,
      pregunta: "¿Cómo se verifica mi identidad?",
      respuesta: "La verificación se realiza a través de tu correo institucional y documentación básica que demuestre tu vinculación actual con la universidad. Este proceso garantiza la seguridad y confiabilidad de nuestra comunidad.",
    },
    {
      id: 6,
      pregunta: "¿Cómo se garantiza la seguridad de mis datos personales?",
      respuesta: "Implementamos medidas de seguridad robustas, incluyendo autenticación JWT y validación de identidad mediante correo institucional y número de boleta. Tus datos solo son compartidos con otros usuarios registrados para organizar viajes y no se venden ni divulgan a terceros.",
    },
    {
        id: 7,
        pregunta: "¿Cómo funciona el sistema de paradas?",
        respuesta: "Los conductores pueden establecer hasta 4 paradas intermedias en su ruta planificada. Las paradas se ubican en lugares concurridos y cerca de transporte público como metro, metrobús, mexibús y cablebús para mayor conveniencia.",
    },
    {
        id: 8,
        pregunta: "¿Cómo se calcula el precio del viaje?",
        respuesta: "El precio se calcula proporcionalmente basado en la distancia recorrida desde tu parada hasta el destino. El conductor establece un precio base para la ruta completa y el sistema distribuye el costo equitativamente entre los pasajeros según su punto de abordaje.",
    },
    {
        id: 9,
        pregunta: "¿Qué documentos necesito para registrarme como conductor?",
        respuesta: "Necesitas tu credencial vigente del IPN, correo institucional activo, datos del vehículo (incluyendo placas, modelo y color), tarjeta de circulación vigente y seguro del automóvil vigente.",
    },
    {
        id: 10,
        pregunta: "¿Qué sucede si el conductor o pasajero no se presenta en el punto de encuentro?",
        respuesta: "Los pasajeros tienen un tiempo máximo de espera de 5 minutos en cada parada designada. Después de este tiempo, si el pasajero no ha llegado a la hora acordada, el conductor pueden continuar su ruta sin esperar a pasajeros adicionales. ",
    },
    {
        id: 11,
        pregunta: "¿Cómo se realiza el pago del servicio?",
        respuesta: "El pago se realiza en efectivo directamente entre el pasajero y el conductor. Al finalizar el viaje, ambas partes deben validar que el pago se ha realizado correctamente.",
    },
    {
        id: 12,
        pregunta: "¿Qué sucede si el conductor o pasajero no se presenta en el punto de encuentro?",
        respuesta: "Los pasajeros tienen un tiempo máximo de espera de 5 minutos en cada parada designada. Después de este tiempo, si el pasajero no ha llegado a la hora acordada, el conductor pueden continuar su ruta sin esperar a pasajeros adicionales. ",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-20 xl:pt-20">
          <div className="mb-8">
            <Link to="/" className="text-primary hover:underline">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">Preguntas Frecuentes</span>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
              PREGUNTAS FRECUENTES
            </h1>
            
            <div className="text-gray-800 mb-8">
              Encuentra respuestas a las preguntas más comunes sobre Student Connect y cómo podemos ayudarte en tu vida universitaria.
            </div>
            
            <div className="space-y-4">
              {preguntas.map((item) => (
                <FAQItem
                  key={item.id}
                  pregunta={item.pregunta}
                  respuesta={item.respuesta}
                />
              ))}
            </div>

            <div className="mt-8 text-right text-sm text-gray-600">
              <p>Para cualquier pregunta adicional, puedes contactarnos en</p>
              <p>soporte@escomstudentconnect.mx</p>
            </div>

            <div className="mt-8">
              <Link 
                to="/" 
                className="inline-flex items-center no-underline px-6 py-3 bg-tertiary text-white font-medium rounded-lg hover:bg-secundary transition-colors"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;