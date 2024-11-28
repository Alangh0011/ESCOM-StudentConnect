// eslint-disable-next-line no-unused-vars
import React from 'react'

const About = () => {
  return (
<div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center p-8 lg:p-14">
    <div className="md:col-span-1 flex justify-center">
        <img src="Carpool.jpg" className="w-full h-auto object-cover"/>
    </div>
        <div className='md:col-span-1'>
        <div className="text-center mt-4 md:mt-[-170px]">
            <h2 className="text-4xl text-secundary font-bold ">Sobre nosotros</h2>
            <p className=" text-base sm:text-lg md:text-2xl py-2 md:py-4 text-justify">
            &quot;Student Connect&quot; es una iniciativa que responde a la necesidad de opciones de transporte más seguras y económicas, para la comunidad estudiantil de la ESCOM.
            <br />La aplicación permite a los usuarios registrarse como conductores o pasajeros, compartir rutas, y realizar reservas de viajes.
            <br />Los estudiantes conductores pueden publicar detalles sobre sus viajes planificados, mientras que los pasajeros pueden buscar y reservar viajes según su conveniencia.
            Además, se pretende promover la interacción entre estudiantes mediante los mismos viajes. 

            </p>
        </div>
        </div>
</div>


        );
    };

export default About;