package com.example.student_connect.service;

import com.example.student_connect.entity.CalificacionViaje;
import com.example.student_connect.repository.CalificacionRepository;
import com.example.student_connect.repository.ViajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CalificacionService {
    @Autowired
    private CalificacionRepository calificacionRepository;

    @Autowired
    private ViajeRepository viajeRepository;

    @Transactional
    public void guardarCalificacion(CalificacionViaje calificacion) {
        // Guardar la calificación
        calificacionRepository.save(calificacion);

        // Obtener el viaje
        var viaje = calificacion.getViaje();

        // Determinar si es calificación del conductor o del pasajero
        boolean esConductor = calificacion.getPasajero() != null;
        if (esConductor) {
            viaje.marcarCalificadoPorConductor();
        } else {
            viaje.marcarCalificadoPorPasajero();
        }

        // Guardar el viaje actualizado
        viajeRepository.save(viaje);
    }

    // Verificar si el viaje ha sido calificado por ambas partes
    public boolean verificarCalificacionesCompletas(Integer viajeId) {
        var viaje = viajeRepository.findById(viajeId)
                .orElseThrow(() -> new RuntimeException("Viaje no encontrado"));
        return viaje.isCalificadoPorConductor() && viaje.isCalificadoPorPasajero();
    }

    // Verificar si un pasajero ya calificó un viaje
    public boolean verificarCalificacionPasajero(Integer viajeId, Integer pasajeroId) {
        return calificacionRepository.existsByViajeIdAndPasajeroId(viajeId, pasajeroId);
    }

    // Verificar si un conductor ya calificó un viaje
    public boolean verificarCalificacionConductor(Integer viajeId) {
        return calificacionRepository.existsByViajeIdAndPasajeroIsNotNull(viajeId);
    }

    public int contarCalificacionesPasajero(Integer pasajeroId) {
        return calificacionRepository.countByPasajeroId(pasajeroId);
    }

    public double calcularPromedioCalificacionesPasajero(Integer pasajeroId) {
        Double promedio = calificacionRepository.getAverageCalificacionByPasajeroId(pasajeroId);
        return promedio != null ? promedio : 5.0;
    }

    public double calcularPromedioCalificacionesConductor(Integer conductorId) {
        Double promedio = calificacionRepository.getAverageCalificacionByConductorId(conductorId);
        return promedio != null ? promedio : 5.0;
    }

    public List<CalificacionViaje> obtenerCalificacionesPorViaje(Integer viajeId) {
        return calificacionRepository.findByViajeId(viajeId);
    }
}