// utils/validaciones.js
export const validarNombreParada = (nombre) => {
    const transportesValidos = [
      "Metro",
      "Metrobús",
      "Mexibús",
      "Suburbano",
      "Cablebús",
      "Mexicable",
      "Trolebús"
    ];
  
    return transportesValidos.some(transporte => 
      nombre.toLowerCase().includes(transporte.toLowerCase())
    );
  };