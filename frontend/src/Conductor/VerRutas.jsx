// VerRutas.jsx
import React, { useEffect, useState } from 'react';

const VerRutas = ({ userId }) => {
    const [rutas, setRutas] = useState([]);

    useEffect(() => {
        // Llamar al backend para obtener las rutas del conductor
        const fetchRutas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/api/rutas/conductor/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener las rutas');
                }
                const data = await response.json();
                setRutas(data);
            } catch (error) {
                console.error('Error al cargar rutas:', error);
            }
        };
        fetchRutas();
    }, [userId]);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Mis Rutas</h2>
            {rutas.length === 0 ? (
                <p>No tienes rutas registradas aún.</p>
            ) : (
                <div>
                    {rutas.map((ruta) => (
                        <div key={ruta.rutaId} className="bg-white rounded-lg shadow p-4 mb-4">
                            <h3 className="font-semibold">Ruta: {ruta.nombreRuta}</h3>
                            <p>Distancia: {ruta.distancia} km</p>
                            <p>Fecha de Publicación: {ruta.fechaPublicacion}</p>
                            <h4 className="font-semibold mt-2">Paradas:</h4>
                            {ruta.paradas && ruta.paradas.length > 0 ? (
                                <ul>
                                    {ruta.paradas.map((parada, index) => (
                                        <li key={index}>
                                            <p>Parada {index + 1}: {parada.paradaNombre}</p>
                                            <p>Distancia: {parada.distanciaParada} km</p>
                                            <p>Costo: ${parada.costoParada}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay paradas registradas para esta ruta.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VerRutas;
