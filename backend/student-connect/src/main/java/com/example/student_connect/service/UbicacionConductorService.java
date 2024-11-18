package com.example.student_connect.service;

import com.example.student_connect.entity.UbicacionConductor;
import com.example.student_connect.entity.Viaje;
import com.example.student_connect.repository.UbicacionConductorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UbicacionConductorService {
    @Autowired
    private UbicacionConductorRepository ubicacionConductorRepository;

    @Autowired
    private ViajeService viajeService;

    public UbicacionConductor guardarUbicacionInicial(UbicacionConductor ubicacion) {
        return ubicacionConductorRepository.save(ubicacion);
    }


    // Método para eliminar ubicaciones de un viaje específico
    public void eliminarUbicacionesViaje(Integer viajeId) {
        try {
            ubicacionConductorRepository.deleteByViajeId(viajeId);
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar ubicaciones del viaje " + viajeId + ": " + e.getMessage(), e);
        }
    }

    public UbicacionConductor guardarUbicacion(double lat, double lng, Integer viajeId) {
        try {
            // Obtener el viaje
            Viaje viaje = viajeService.obtenerViajePorId(viajeId);

            // Buscar ubicación existente
            Optional<UbicacionConductor> ubicacionExistente =
                    ubicacionConductorRepository.findTopByViajeIdOrderByTimestampDesc(viajeId);

            UbicacionConductor ubicacion;
            if (ubicacionExistente.isPresent()) {
                // Actualizar la ubicación existente
                ubicacion = ubicacionExistente.get();
                ubicacion.setLat(lat);
                ubicacion.setLng(lng);
                ubicacion.setTimestamp(LocalDateTime.now());
            } else {
                // Crear una nueva ubicación
                ubicacion = new UbicacionConductor(viaje, lat, lng);
            }

            return ubicacionConductorRepository.save(ubicacion);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar ubicación: " + e.getMessage(), e);
        }
    }

    public UbicacionConductor obtenerUltimaUbicacion(Integer viajeId) {
        return ubicacionConductorRepository.findTopByViajeIdOrderByTimestampDesc(viajeId)
                .orElseThrow(() -> new RuntimeException("No se encontró ubicación para el viaje " + viajeId));
    }
}