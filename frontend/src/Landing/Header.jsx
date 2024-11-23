import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const Header = ({ location }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setShowMenu(false);

    const element = document.getElementById(sectionId.replace('#', ''));
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

  const navLinks = [
    { href: '#inicio', text: 'Inicio' },
    { href: '#sobre-nosotros', text: 'Sobre nosotros' },
    { href: '#caracteristicas', text: 'Características' },
    { href: '#requisitos', text: 'Requisitos' },
    { href: '#contacto', text: 'Contacto' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full bg-white transition-all duration-300 z-50 h-20 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center h-full">
          {/* Logo */}
          <h1 className="text-2xl font-bold">
            <Link to="/" className="no-underline text-black">
              Student Connect
              <span className="cursor-pointer text-primary">.</span>
            </Link>
          </h1>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="bg-white text-gray-600 py-2 px-4 no-underline hover:text-secundary transition-all"
                >
                  {link.text}
                </a>
              ))}
            </nav>
          </div>

          {/* Desktop Login Icon */}
          <Link
            to="/login"
            className="hidden lg:flex items-center text-tertiary py-2 px-4 no-underline  transition-all gap-2"
            aria-label="Iniciar Sesión"
          >
            <User className="w-5 h-5" />
            <span className="hidden lg:block"></span>
          </Link>

          {/* Mobile/Tablet Menu Button */}
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="ml-auto lg:hidden" 
            aria-label="Menu"
          >
            <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              showMenu ? 'rotate-45 translate-y-1.5' : ''
            }`} />
            <div className={`w-6 h-0.5 bg-gray-700 my-1.5 transition-all duration-300 ${
              showMenu ? 'opacity-0' : ''
            }`} />
            <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              showMenu ? '-rotate-45 -translate-y-1.5' : ''
            }`} />
          </button>
        </div>

        {/* Mobile/Tablet Menu */}
        <nav 
          className={`lg:hidden absolute left-0 right-0 bg-white px-4 py-2 shadow-md transition-all duration-300 ${
            showMenu ? 'top-full opacity-100' : '-top-96 opacity-0'
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="block w-full text-left mb-2 bg-transparent text-gray-600 py-2 px-4 rounded no-underline hover:bg-primary hover:text-white hover:border-primary/10 transition-all"
            >
              {link.text}
            </a>
          ))}
          <Link
            to="/login"
            className="flex items-center justify-between w-full bg-transparent text-primary py-2 px-4 no-underline"
          >
            <span>Iniciar Sesión</span>
            <User className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;