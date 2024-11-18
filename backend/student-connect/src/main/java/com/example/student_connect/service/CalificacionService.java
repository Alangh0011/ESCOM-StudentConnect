package com.example.student_connect.service;

import com.example.student_connect.entity.CalificacionViaje;
import com.example.student_connect.repository.CalificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CalificacionService {

    @Autowired
    private CalificacionRepository calificacionRepository;

    @Transactional
    public void guardarCalificacion(CalificacionViaje calificacion) {
        calificacionRepository.save(calificacion);
    }

    public int contarCalificacionesPasajero(Integer pasajeroId) {
        return calificacionRepository.countByPasajeroId(pasajeroId);
    }

    public double calcularPromedioCalificacionesPasajero(Integer pasajeroId) {
        Double promedio = calificacionRepository.getAverageCalificacionByPasajeroId(pasajeroId);
        return promedio != null ? promedio : 5.0; // Valor por defecto si no hay calificaciones
    }

    public double calcularPromedioCalificacionesConductor(Integer conductorId) {
        Double promedio = calificacionRepository.getAverageCalificacionByConductorId(conductorId);
        return promedio != null ? promedio : 5.0; // Valor por defecto
    }

    // Método adicional para obtener todas las calificaciones de un viaje
    public List<CalificacionViaje> obtenerCalificacionesPorViaje(Integer viajeId) {
        return calificacionRepository.findByViajeId(viajeId);
    }
}