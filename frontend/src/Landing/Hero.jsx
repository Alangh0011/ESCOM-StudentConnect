// eslint-disable-next-line no-unused-vars
import React from 'react';
import { VscArrowSmallRight } from "react-icons/vsc";
import { Link } from 'react-router-dom';

const Hero = () => {
  const video = 'Ruta.mp4';

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">      
      <div className="w-full lg:w-2/3 flex items-center justify-center h-full p-8">
        <div className='flex flex-col gap-3'>
          <h1 className='text-7xl font-bold leading-[9rem]'>
            Conecta con <br/> 
            <span className='text-secundary text-center px-2 border-8 border-secundary relative inline-block'>
              Student Connect
            </span>
          </h1>
          <p className='text-secundary font-bold text-3xl -px-2'>
            Redescubre como moverte con Student Connect
          </p>
          <p className='text-grey-900'>
            La convivencia se une a la comodidad en una
            comunidad donde cada viaje mejora tu experiencia diaria.
          </p>
          <div className='flex flex-col md:flex-row items-center gap-8'>
            <Link 
              to="/registro"
              className='w-full xl:w-auto flex items-center bg-tertiary text-white justify-start text-left gap-4 -py-4 px-4 rounded-xl text-xl'
            >
              Regístrate <VscArrowSmallRight className='p-4 rounded-full box-content'/>
            </Link>
            <button 
              onClick={(e) => handleClick(e, '#testimonios')}
              className='w-full xl:w-auto items-center bg-secundary text-white py-3 px-12 rounded-xl text-xl hover:bg-gray-500 transition-colors'
            > 
              Conócenos 
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenedor de lado derecho */}
      <div className="hidden lg:flex h-full w-1/3 items-center justify-center">
        <video className='md:col-span-5 flex items-center justify-center w-full h-[75%]' autoPlay muted loop>
          <source src={video} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default Hero;