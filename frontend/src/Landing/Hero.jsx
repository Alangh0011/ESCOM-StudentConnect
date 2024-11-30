import React from 'react';
import { VscArrowSmallRight } from "react-icons/vsc";
import { Link } from 'react-router-dom';

const Hero = () => {
  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="min-h-screen relative">
      {/* Contenido central con más espacio arriba y z-index */}
      <div className="w-full h-full flex items-start pt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex flex-col items-center text-center">      
            <div className='flex flex-col gap-8 mb-32'>
              {/* Logo o título si lo hay */}
              <div className='mb-8'>
                {/* Aquí iría el logo si es necesario */}
              </div>

              {/* Título principal */}
              <h1 className='text-5xl lg:text-7xl font-bold'>
                Conecta con
                <div className='mt-4'>
                  <span className='text-secundary border-4 lg:border-8 border-secundary px-12 py-2 inline-block'>
                    Student Connect
                  </span>
                </div>
              </h1>

              {/* Subtítulo */}
              <h2 className='text-secundary font-bold text-2xl lg:text-4xl'>
                Redescubre como moverte con Student Connect
              </h2>

              {/* Descripción */}
              <p className='text-gray-600 text-xl max-w-3xl mx-auto'>
                La convivencia se une a la comodidad en una
                comunidad donde cada viaje mejora tu experiencia diaria.
              </p>

              {/* Botones */}
              <div className='flex flex-col sm:flex-row gap-6 justify-center'>
                <Link
                  to="/register"  
                  className='flex items-center justify-center no-underline bg-tertiary text-white px-6 py-3 rounded-xl text-lg lg:text-xl  hover:bg-[#A92D6B] transition-colors'
                >
                  Regístrate
                  <VscArrowSmallRight className='ml-2 text-2xl' />
                </Link>
                <button
                  onClick={(e) => handleClick(e, '#testimonios')}
                  className='flex items-center justify-center bg-secundary text-white px-8 py-3 rounded-xl text-lg lg:text-xl hover:bg-primary transition-colors'
                >
                  Conócenos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave SVG en la parte inferior con z-index menor */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 190"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            fill="#6C1D45"
            fillOpacity="0.95"
            d="M0,96L48,85.3C96,75,192,53,288,69.3C384,85,480,139,576,170.7C672,203,768,213,864,186.7C960,160,1056,96,1152,74.7C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </main>
  );
};

export default Hero;