import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonios = [
  {
    id: 1,
    nombre: "Monse Vázquez",
    rol: "Estudiante ISC",
    testimonio: "Excelente servicio, me ha ayudado mucho a llegar segura a ESCOM. Los conductores siempre son puntuales y amables.",
    imagen: "user1.jpg"
  },
  {
    id: 2,
    nombre: "Carlos Mendoza",
    rol: "Estudiante 6to semestre IA",
    testimonio: "Como conductor, la aplicación me ha permitido ayudar a otros estudiantes mientras comparto gastos. Una experiencia muy gratificante.",
    imagen: "user2.jpg"
  },
  {
    id: 3,
    nombre: "Laura Sánchez",
    rol: "Estudiante 4to semestre ICD",
    testimonio: "Me encanta la comunidad que se ha formado. He conocido compañeros increíbles durante los viajes compartidos.",
    imagen: "user3.jpg"
  },
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Efecto para la transición automática
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === testimonios.length - 1 ? 0 : prevIndex + 1
        );
      }, 10000); // Cambia cada 5 segundos
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonios.length - 1 ? 0 : prevIndex + 1
    );
    setIsAutoPlaying(false); // Detiene la reproducción automática cuando el usuario interactúa
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonios.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false); // Detiene la reproducción automática cuando el usuario interactúa
  };

  // Manejador para reanudar la reproducción automática
  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Manejador para pausar la reproducción automática
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  return (
    <div id="testimonios" className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Elige Student Connect
        </h2>
       
        <div className="flex justify-center mb-12">
          <div className="w-24 h-1 bg-tertiary"></div>
          <div className="w-4 h-1 bg-secundary ml-1"></div>
        </div>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Anterior testimonio"
          >
            <FaChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Siguiente testimonio"
          >
            <FaChevronRight className="w-4 h-4 text-gray-600" />
          </button>

          <div className="text-center px-8 transition-opacity duration-500">
            <p className="text-secundary text-lg mb-8 leading-relaxed">
              {testimonios[currentIndex].testimonio}
            </p>
           
            <div className="flex flex-col items-center">
              <img
                src={testimonios[currentIndex].imagen}
                alt={testimonios[currentIndex].nombre}
                className="w-16 h-16 rounded-full object-cover mb-4"
              />
              <h3 className="font-semibold text-gray-800 text-lg">
                {testimonios[currentIndex].nombre}
              </h3>
              <p className="text-gray-500">
                {testimonios[currentIndex].rol}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;