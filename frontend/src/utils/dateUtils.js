// utils/dateUtils.js
export const formatearFechaISO = (fechaStr) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr + 'T00:00:00Z');
    return fecha.toISOString().split('T')[0];
};

export const formatearFechaLocal = (fechaStr) => {
    if (!fechaStr) return '';
    const [year, month, day] = fechaStr.split('-'); // Divide el string en componentes
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`; // Formatea manualmente
};



export const esMismaFecha = (fecha1, fecha2) => {
    const d1 = new Date(fecha1 + 'T00:00:00Z');
    const d2 = new Date(fecha2 + 'T00:00:00Z');
    return d1.getTime() === d2.getTime();
};