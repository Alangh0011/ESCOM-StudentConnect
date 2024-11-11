export const actualizarDistanciaTotal = async (rutaId, distanciaTotal) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token no disponible. Por favor, inicia sesión.");
      return;
    }

    const response = await fetch(`http://localhost:8080/api/rutas/${rutaId}/actualizarDistancia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ distancia: distanciaTotal }),
    });
    

    if (response.ok) {
      console.log('Distancia total actualizada correctamente en el backend');
    } else {
      console.error('Error al actualizar la distancia total en el backend');
    }
  } catch (error) {
    console.error('Error en la solicitud para actualizar la distancia total:', error);
  }
};
