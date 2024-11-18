package com.example.student_connect.controller;

import com.example.student_connect.dto.UbicacionRequest;
import com.example.student_connect.dto.UbicacionResponse;
import com.example.student_connect.entity.UbicacionConductor;
import com.example.student_connect.entity.Viaje;
import com.example.student_connect.enums.EstadoViaje;
import com.example.student_connect.security.utils.Mensaje;
import com.example.student_connect.service.UbicacionConductorService;
import com.example.student_connect.service.ViajeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/ubicacion")
@Slf4j
public class UbicacionController {

    @Autowired
    private UbicacionConductorService ubicacionConductorService;

    @Autowired
    private ViajeService viajeService;

    @GetMapping("/ultima/{viajeId}")
    @PreAuthorize("hasRole('PASAJERO') or hasRole('CONDUCTOR')")
    public ResponseEntity<?> obtenerUltimaUbicacion(@PathVariable Integer viajeId) {
        try {
            UbicacionConductor ubicacion = ubicacionConductorService.obtenerUltimaUbicacion(viajeId);

            // Verificar si la ubicación es reciente (menos de 1 minuto)
            boolean ubicacionReciente = ubicacion.getTimestamp()
                    .isAfter(LocalDateTime.now().minusMinutes(1));

            UbicacionResponse response = new UbicacionResponse(
                    ubicacion.getLat(),
                    ubicacion.getLng(),
                    ubicacion.getTimestamp(),
                    ubicacionReciente
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al obtener ubicación para viaje {}: {}", viajeId, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new Mensaje("Error al obtener ubicación: " + e.getMessage()));
        }
    }

    @PostMapping("/actualizar/{viajeId}")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> actualizarUbicacion(
            @PathVariable Integer viajeId,
            @RequestBody UbicacionRequest request) {
        try {
            log.info("Recibiendo actualización de ubicación para viaje {}: lat={}, lng={}",
                    viajeId, request.getLat(), request.getLng());

            // Validar coordenadas
            if (!isValidLocation(request.getLat(), request.getLng())) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("Coordenadas inválidas"));
            }

            // Obtener y validar el viaje
            Viaje viaje = viajeService.obtenerViajePorId(viajeId);
            if (viaje == null || viaje.getEstado() != EstadoViaje.EN_CURSO) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("El viaje no está activo"));
            }

            // Actualizar ubicación
            UbicacionConductor ubicacion = ubicacionConductorService.guardarUbicacion(
                    request.getLat(),
                    request.getLng(),
                    viajeId
            );

            log.info("Ubicación actualizada correctamente para viaje {}", viajeId);

            return ResponseEntity.ok(new UbicacionResponse(
                    ubicacion.getLat(),
                    ubicacion.getLng(),
                    ubicacion.getTimestamp(),
                    true
            ));
        } catch (Exception e) {
            log.error("Error al actualizar ubicación para viaje {}: {}", viajeId, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new Mensaje("Error al actualizar ubicación: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{viajeId}")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> eliminarUbicaciones(@PathVariable Integer viajeId) {
        try {
            // Limpiar ubicaciones antiguas al finalizar el viaje
            ubicacionConductorService.eliminarUbicacionesViaje(viajeId);
            return ResponseEntity.ok(new Mensaje("Ubicaciones eliminadas correctamente"));
        } catch (Exception e) {
            log.error("Error al eliminar ubicaciones del viaje {}: {}", viajeId, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new Mensaje("Error al eliminar ubicaciones"));
        }
    }

    private boolean isValidLocation(double lat, double lng) {
        return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    }
}