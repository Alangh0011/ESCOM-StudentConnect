// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';

const Priv = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-20 xl:pt-20">
          <div className="mb-8">
            <Link to="/" className="text-primary hover:underline">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">Política de Privacidad</span>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
              AVISO DE PRIVACIDAD
            </h1>

            <div className="space-y-4 text-gray-800">
              <p className="text-justify">
                Con fundamento en los artículos 15 y 16 de la Ley Federal de Protección de Datos 
                Personales en Posesión de Particulares hacemos de su conocimiento que
                <span className="font-semibold"> Student Connect</span>, es responsable de recabar sus datos personales, del uso que se le 
                dé a los mismos y de su protección.
              </p>

              <p className="text-justify">
                <span className="font-semibold">Student Connect</span>, es responsable del uso y protección de sus datos personales, en 
                este sentido y atendiendo las obligaciones legales establecidas en la Ley Federal de 
                Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), a través de 
                este instrumento se informa a los titulares de los datos, la información que de ellos se 
                recaba y los fines que se le darán a dicha información.
              </p>

              <p className="text-justify">
                Los datos personales que recabamos de usted serán utilizados para las siguientes 
                finalidades, las cuales son necesarias para concretar nuestra relación con usted, así 
                como atender los servicios y/o pedidos que solicite:
              </p>

              <ul className="list-disc pl-8 space-y-2">
                <li>Crear y administrar tu cuenta en la plataforma</li>
                <li>Conectarte con otros estudiantes que ofrecen o buscan transporte</li>
                <li>Enviar notificaciones sobre cambios en nuestro servicio o nuevas funcionalidades</li>
                <li>Mejorar y personalizar tu experiencia de usuario</li>
              </ul>

              <p className="text-justify mt-4">
                Para las finalidades señaladas en el presente aviso de privacidad, utilizaremos los 
                siguientes datos personales:
              </p>

              <div className="pl-8">
                <p className="font-semibold">Usuario</p>
                <ul className="list-disc pl-8 space-y-1">
                  <li>Nombre</li>
                  <li>Correo institucional</li>
                  <li>Número de matrícula</li>
                  <li>Ubicación en tiempo real durante los viajes</li>
                  <li>Datos del vehículo, como placa del vehículo, color, modelo (Aplica solo para el registro de conductores)</li>
                </ul>
              </div>

              <p className="text-justify mt-4">
                Se le informa que solo compartimos tus datos con otros usuarios registrados dentro de 
                la aplicación para organizar los viajes. No vendemos, alquilamos ni divulgamos tus 
                datos a terceros para fines comerciales.
              </p>

              <p className="text-justify">
                Puedes acceder, rectificar o cancelar tus datos personales, así como oponerte a su 
                uso a través de nuestra plataforma o enviando una solicitud a 
                privacidad@escomstudentconnect.mx
              </p>

              <p className="text-justify">
                Cualquier cambio en este aviso se comunicará a través de nuestra plataforma y sitio 
                web.
              </p>
            </div>

            <div className="mt-8 text-right text-sm text-gray-600">
              <p>Para cualquier pregunta o comentario sobre este aviso, puedes contactarnos en</p>
              <p>privacidad@escomstudentconnect.mx</p>

              
            </div>
            <div className="mt-8">
              <Link 
                to="/" 
                className="inline-flex items-center px-6 py-3 bg-tertiary text-white font-medium rounded-lg hover:bg-secundary transition-colors"
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

export default Priv;