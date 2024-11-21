import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleNavClick = (e, id) => {
    if (location.pathname === '/') {
      e.preventDefault();
      setShowMenu(false);
      
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
    }
  };

  const navLinks = [
    { href: '#inicio', text: 'Inicio' },
    { href: '#sobre-nosotros', text: 'Sobre nosotros' },
    { href: '#caracteristicas', text: 'Características' },
    { href: '#requisitos', text: 'Requisitos' },
    { href: '#contacto', text: 'Contacto' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full py-6 md:py-4 px-6 md:px-8 h-[10vh] z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/90'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between xl:justify-between">
        {/* Logo */}
        <div className="w-auto xl:w-1/6">
          <Link 
            to="/"
            className="text-xl md:text-2xl font-bold relative flex items-center"
          >
            Student Connect <span className="text-secundary text-3xl">.</span>
          </Link>
        </div>

        {/* Menú Desktop */}
        <nav className="hidden xl:flex xl:justify-center xl:flex-1">
          <div className="flex items-center gap-5">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-secundary text-sm border border-secundary/10 
                bg-transparent py-2 px-5 rounded transition-colors hover:bg-secundary 
                hover:text-white"
              >
                {item.text}
              </a>
            ))}
          </div>
        </nav>

        {/* User Icon */}
        <div className="flex items-center gap-4 ml-4">
          <Link
            to="/login"
            className="text-secundary hover:text-secundary/70 transition-colors p-2"
          >
            <User className="h-6 w-6" />
          </Link>
        </div>

        {/* Botón de menú móvil */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="xl:hidden flex flex-col justify-center gap-1.5 p-2 z-50"
          aria-label="Menu"
        >
          <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${showMenu ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${showMenu ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${showMenu ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>

        {/* Menú Móvil */}
        <nav
          className={`xl:hidden fixed top-0 left-0 w-full h-screen bg-white z-40 
          flex flex-col items-center justify-center gap-8 transition-all duration-500 
          ${showMenu ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        >
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-secundary text-xl w-auto text-center 
              transition-colors hover:text-secundary/70"
            >
              {item.text}
            </a>
          ))}
          <Link
            to="/login"
            className="text-secundary text-xl w-auto text-center 
            transition-colors hover:text-secundary/70"
          >
            <User className="h-6 w-6" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;