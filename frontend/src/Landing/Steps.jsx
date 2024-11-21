// eslint-disable-next-line no-unused-vars
import React from 'react';

// eslint-disable-next-line react/prop-types
const Card = ({ title, description, imageSrc }) => {
    return (
        <article className="flex flex-col items-center rounded-xl shadow-lg overflow-hidden border border-gray-200 w-80">
            <div className="h-48 overflow-hidden">
                <img src={imageSrc}  className="w-full h-full object-cover" />
            </div>
            <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 text-md text-justify" dangerouslySetInnerHTML={{ __html: description }}></p>
            </div>
        </article>
    );
};

const Steps = () => {
    return (
        <div>
            <div className="">
                <h2 className="text-4xl text-secundary font-bold text-center  ">
                    Características
                </h2>
            </div>
            <div className="flex items-center justify-center p-8 xl:p-14">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <Card
                        imageSrc="Perfil.gif"
                        title="Gestión de perfiles "
                        description={`Los estudiantes crean perfiles, proporcionando información personal y seleccionando si desean actuar como conductores o pasajeros.`}
                    />
                    <Card
                        imageSrc="ruta.gif"
                        title="Publicación y búsqueda de viajes"
                        description={`Los conductores publican detalles de sus viajes y los pasajeros buscan viajes que se alineen con sus necesidades.`}
                    />
                    <Card
                        imageSrc="herencia.gif"
                        title="Reservas y confirmaciones"
                        description="Los pasajeros pueden reservar asientos en viajes disponibles y los conductores confirman estas reservas."
                    />
                    <Card
                        imageSrc="evaluacion.gif"
                        title="Monitoreo y evaluación"
                        description="La aplicación cuenta con un sistema de monitoreo y evaluación para asegurar la calidad y seguridad de los viajes.
                        Los usuarios pueden dejar comentarios y calificar sus experiencias."
                    />
                    <Card
                        imageSrc="dinero.gif"
                        title="Incentivos para conductores"
                        description="La aplicación cuenta con un sistema de monitoreo y evaluación para asegurar la calidad y seguridad de los viajes.
                        Los usuarios pueden dejar comentarios y calificar sus experiencias."
                    />
                        <Card
                        imageSrc="referirse.gif"
                        title="Identidad universitaria"
                        description="Fomenta la creación de una comunidad más fuerte al compartir viajes, 
                        lo que puede aumentar la colaboración y el sentido de pertenencia entre los estudiantes."
                    />
                </div>
            </div>
        </div>
    );
};

export default Steps;
