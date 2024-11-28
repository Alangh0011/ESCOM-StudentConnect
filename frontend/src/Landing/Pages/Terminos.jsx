import React, { useLayoutEffect} from 'react';
import { Link} from 'react-router-dom';

const Terminos = () => {
  
  useLayoutEffect(() => {
    window.scrollTo(0, 1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 lg:px-20">
        <div  className="pt-20 sm:pt-24 md:pt-28 lg:pt-20 xl:pt-20">
          <div className="mb-8">
            <Link to="/" className="text-primary hover:underline">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Términos y Condiciones</span>
            <p className="text-gray-800 text-justify block">
            <br/>
            Student Connect brinda un servicio de transporte compartido que permite a nuestros estudiantes de la 
            ESCOM acceder a viajes seguros el "servicio de transporte", a través de una aplicación web que puede utilizarse en computadoras y otros dispositivos conectados a internet
            "dispositivos compatibles". <br/>
            Estos Términos de uso rigen el uso que haga de nuestro servicio, según se utilicen en estos Términos de uso, "el servicio de Student Connect", 
            "nuestro servicio" o "el servicio" se refieren al servicio brindado por Student Connect para publicar, 
            descubrir y acceder a viajes compartidos, incluidas todas las características y funcionalidades, sistema de reservas, calificaciones y reseñas,
            nuestra aplicación web y las interfaces de usuario, así como todo el contenido y software asociado a nuestro servicio. <br/>
            Las referencias a "usted" en estos Términos de uso señalan al estudiante que creó la cuenta de Student Connect, ya sea como conductor o pasajero, 
            utilizando un correo institucional válido del IPN y una matrícula activa de ESCOM.  
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Términos y Condiciones
            </h1>
            <div className="space-y-6 text-gray-600 text-justify">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  1. Elegibilidad y registro
                </h2>
                <p className="mb-4 px-4">
                    El servicio está exclusivamente disponible para estudiantes activos de la Escuela Superior de Cómputo 
                    "ESCOM" del Instituto Politécnico Nacional "IPN";               
                </p>

                <p className="mb-4 px-4">
                    1.2. Para registrarse, los usuarios deberán:             
                </p>

                <ul className="list-disc pl-14 space-y-2 ">
                  <li>Se requiere verificación mediante el correo institucional del IPN</li>
                  <li>Se verificará que el número de boleta corresponda a un estudiante activo de ESCOM <br/>
                      En caso de pertenener a ESCOM,y no contar con un número de boleta valido, se hará un proceso manual
                      para validar que eres un estudiante activo de la ESCOM.
                  </li>
                  <li>Es obligatorio contar con una credencial oficial de la ESCOM vigente</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  2. Conductores
                </h2>
                <p className="mb-4 px-4 mt-4">
                  2.1 Requisitos especificos: 
                </p>
                <ul className="list-disc pl-14 space-y-2">
                  <li>Licencia de conducir vigente</li>
                  <li>Documentación del vehículo actualizada</li>
                  <li>Seguro de cobertura amplia del automóvil vigente.</li>
                </ul>
                <p className="mb-4 px-4 mt-4">
                  2.2 Obligaciones de conductor: 
                </p>
                <ul className="list-disc pl-14 space-y-2">
                  <li>Publicar sus rutas semanales antes del sábado a las 10:00 p.m.</li>
                  <li>Mantener todos los documentos del vehículo vigentes y en orden.</li>
                  <li>Seguir estrictamente la ruta publicada en la aplicación.</li>
                  <li>Respetar un tiempo máximo de espera de 5 minutos en cada paradas.</li>
                </ul>
                <p className="mb-4 px-4 mt-4">
                  2.2 Calificaciones: 
                </p>
                <ul className="list-disc pl-14 space-y-2">
                  <li>Los conductores deben mantener una calificación mínima de 2 estrellas.</li>
                  <li>Calificaciones inferiores pueden resultar en suspensión temporal o permanente.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  3. Pasajeros
                </h2>
                <p className="mb-4 px-4">
                  3.1 Obligaciones del pasajero:
                </p>
                <ul className="list-disc pl-14 space-y-2">
                  <li>Llegar puntualmente a la parada designadas.</li>
                  <li>Realizar el pago en efectivo al finalizar el viaje.</li>
                  <li>Mantener un comportamiento respetuoso durante el trayecto.</li>
                  <li>Proporcionar una calificación y retroalimentación después del viaje.</li>
                </ul>
                <p className="mb-4 px-4 mt-4">
                  3.2 Derechos del pasajero:
                </p>
                <ul className="list-disc pl-14 space-y-2">
                  <li>Conocer la información del conductor y vehículo.</li>
                  <li>Reportar cualquier incidente durante el servicio.</li>
                  <li>Acceder al seguimiento en tiempo real del viaje.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  4. Sistema de Rutas y Reservas
                </h2>
                <p className="mb-4 px-4 mt-4 ">
                  4.1 Las rutas y paradas estas preestablecidas previamente por los conductores, estas se actualizan semanalmente de acuerdo al criterio del conductor.
                </p>
                <p className="mb-4 px-4">
                  4.2 Las paradas son estrictamente y exclusivamente en
                  lugares públicos, por ejemplo, una parada de Autobús, Camión, Microbús, Combi, RTP, Metrobús, 
                  Metro, Cablebus, Trolebús, Tren Ligero, Suburbano.
                </p>
                <p className="mb-4 px-4">
                  4.2 Las reservaciones pueden realizarce con anticipación dentro de la plataforma así mismo 
                  se les pide considerar los siguientes criterios a continuación:
                </p>
                <ul className="list-disc pl-14 space-y-2">
                  <li>Se debe especificar la parada de abordaje.</li>
                  <li>Las reservas están sujetas a disponibilidad.</li>
                </ul>
                <p className="mb-4 px-4 mt-4 font-bold">
                Los cambios de última hora pueden incurir en la calificación y baja/suspensión de la cuenta.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  5. Sistema de pago
                </h2>
                <p className="mb-4 px-4 mt-4">
                  El pago será exclusivamente en efectivo, este será validado por el conductor una vez finalizado el viaje.
                </p>
                <p className="mb-4 px-4">
                  5.1 La tarifa base es proporcionada por el conductor, 
                  el sistema calculará el costo proporcional por cada una de las paradas. 
                  Los precios para cada parada serán razonables y justificados de acuerdo a la distancia. 
                </p>
              <p className="mb-4 px-4 mt-4 font-bold">
                No se permiten cobros adicionales no autorizados.
              </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  6. Sistema de calificaciones
                </h2>
                <p className="mb-4 px-4 mt-4">
                  La evaluación será de manera mutua, es decir, conductores y pasajeros se calificaran mutuamente.
                  La escala de evaluación será de 1 a 5 estrellas, de acuerdo al punto 2.2 de calificaciones, los conductores deberán tener una evaluación mínima de 2 estrellas. En caso de tener por debajo del 
                  promedio, esto incurrira en una baja temporal/permanente del sistema. 
                </p>
                <p className="mb-4 px-4">
                  6.1 En caso de cancelar una ruta o viaje, incurrirá en una penalización de .2 sobre la calificación
                  para conductor/pasajero, según sea el caso.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  7. Seguridad y privacidad
                </h2>
                <p className="mb-4 px-4 mt-4">
                La verificación de identidad es obligatoria para los usuarios de Student Connect, sin importar su rol dentro del sistema.
                
                </p>
                <p className="mb-4 px-4">
                  7.1 Los viajes serán monitoreados en tiempo real por los usuarios,
                  por cualquier incidente o falta de los mismos.
                </p>
                <p className="mb-4 px-4">
                  7.2 Los datos recopilados y/o solicitados por Student Connect, son de uso exclusivo del sistema
                  para la validación del registro, mismos que se rigen por el cumplimiento de las leyes de protección
                  de datos en México. 
                </p>
                <p className="mb-4 px-4 mt-4 font-bold">
                Usted puede consultar en cualquier momento nuestro Aviso de Privacidad
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  8. Sanciones y suspensiones
                </h2>
                <ul className="list-disc pl-14 space-y-2">
                  <li>Calificaciones consistentemente bajas.</li>
                  <li>Incumplimiento de términos y condicione.</li>
                  <li>Comportamiento inadecuado o peligroso.</li>
                  <li>Reportes verificados de mal servicio.</li>
                </ul>
                <p className="mb-4 px-4 mt-4 font-bold">
                El tipo de sanción dependerá de la severidad de la falta, estás pueden ser, advertencias y/o
                suspención temporal o permanente del sistema 
                </p>      
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  9. Limitaciones de responsalibilidad
                </h2>
                <p className="mb-4 px-4 mt-4 ">
                Student Connect actúa exclusivamente como una plataforma intermediaria que facilita la conexión entre estudiantes conductores y pasajeros de la ESCOM,
                sin asumir responsabilidad directa sobre las interacciones o acontecimientos que surjan entre los usuarios.
                <br/>Es importante destacar que la plataforma no se hace responsable por accidentes de tránsito, siendo estos responsabilidad exclusiva del conductor y 
                quedando sujetos a las leyes de tránsito vigentes y a las coberturas de los seguros correspondientes.
                <br/> Si bien nos esforzamos por mantener un servicio constante y confiable,
                no podemos garantizar la disponibilidad ininterrumpida de la plataforma debido a actualizaciones técnicas, mantenimiento del sistema o factores externos fuera de nuestro control.
                <br/> Student Connect no asume responsabilidad por eventos o circunstancias que puedan afectar la prestación del servicio, incluyendo pero no limitándose a: fallas técnicas o 
                mecánicas de los vehículos, siendo estas responsabilidad exclusiva del conductor mantener su automóvil en óptimas condiciones; condiciones climatológicas adversas que puedan afectar la seguridad o puntualidad del servicio, en cuyo caso se recomienda 
                a los usuarios ejercer su mejor 
                juicio para determinar la viabilidad del viaje; problemas de conectividad o interrupciones 
                en el servicio de internet que puedan 
                afectar el funcionamiento de la aplicación o el 
                seguimiento en tiempo real de las rutas; y cualquier disputa o desacuerdo personal que pueda surgir entre usuarios durante la prestación del servicio.
                En estos casos, si bien la plataforma puede actuar como mediador inicial, la resolución final de estos conflictos recae directamente en las partes involucradas. 
                <br/> Adicionalmente, Student Connect no asume responsabilidad por objetos personales olvidados durante los viajes; sin embargo, facilitamos la comunicación entre usuarios
                para la posible recuperación de estos artículos, quedando la gestión y resolución de estas situaciones
                bajo la responsabilidad directa de las partes involucradas.
                </p>      
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  10. Modificaciones a los Términos y Condiciones
                </h2>
                <p className="mb-4 px-4 mt-4 ">
                Student Connect se reserva el derecho de actualizar o modificar estos términos y condiciones periódicamente para reflejar cambios en nuestro servicio, 
                cumplir con nuevas disposiciones legales o mejorar la experiencia de nuestros usuarios. Cualquier modificación significativa en estos términos será notificada 
                a través de un aviso visible en la plataforma y/o mediante un correo electrónico a la dirección registrada del usuario, con un mínimo de 15 días de anticipación 
                a su entrada en vigor. La continuidad en el uso de nuestros servicios después de la fecha efectiva de cualquier modificación constituirá la aceptación tácita de 
                los nuevos términos por parte del usuario. No obstante, si algún usuario no está de acuerdo con los cambios realizados, tiene el derecho de objetar las modificaciones
                 y/o dar por terminado el uso del servicio antes de la fecha de entrada en vigor de dichos cambios, notificándolo a través de los canales oficiales de la plataforma.
                </p>      
              </section>

              <p className="mb-4 mt-4 ">
              Al utilizar Student Connect, usted acepta estos términos y condiciones en su totalidad. 
              <br/> Si tienes alguna pregunta sobre estos Términos y Condiciones o dudas, reclamos o solicitudes con respecto a tu información, 
              puedes ponerte en contacto con nosotros a través de redes sociales y página web.
              </p>  

            </div>

            {/* Back to Home Button */}
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

export default Terminos;