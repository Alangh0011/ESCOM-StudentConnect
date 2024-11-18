package com.example.student_connect.controller;

import com.example.student_connect.dto.CalificacionRequestDTO;
import com.example.student_connect.entity.CalificacionViaje;
import com.example.student_connect.entity.Viaje;
import com.example.student_connect.enums.EstadoViaje;
import com.example.student_connect.security.entity.Pasajero;
import com.example.student_connect.security.entity.Usuario;
import com.example.student_connect.security.service.UsuarioService;
import com.example.student_connect.security.utils.Mensaje;
import com.example.student_connect.service.CalificacionService;
import com.example.student_connect.service.ViajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calificaciones")
public class CalificacionController {

    @Autowired
    private CalificacionService calificacionService;

    @Autowired
    private ViajeService viajeService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/conductor/calificar-pasajero")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> calificarPasajero(@RequestBody CalificacionRequestDTO request) {
        try {
            Viaje viaje = viajeService.obtenerViajePorId(request.getViajeId());

            // Verificar que el viaje esté finalizado
            if (viaje.getEstado() != EstadoViaje.FINALIZADO) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("El viaje debe estar finalizado para calificar"));
            }

            // Obtener el pasajero
            Pasajero pasajero = usuarioService.obtenerPasajeroPorId(request.getPasajeroId());
            if (pasajero == null) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("Pasajero no encontrado"));
            }

            // Registrar la nueva calificación
            CalificacionViaje calificacion = new CalificacionViaje();
            calificacion.setViaje(viaje);
            calificacion.setPasajero(pasajero);
            calificacion.setCalificacion(request.getCalificacion());
            calificacion.setComentario(request.getComentario());
            calificacionService.guardarCalificacion(calificacion);

            // Calcular y actualizar el promedio del pasajero
            double promedioActual = pasajero.getCalificacion();
            double nuevaCalificacion = request.getCalificacion();
            int totalCalificaciones = calificacionService.contarCalificacionesPasajero(pasajero.getId());

            double nuevoPromedio = ((promedioActual * (totalCalificaciones - 1)) + nuevaCalificacion) / totalCalificaciones;
            pasajero.setCalificacion(nuevoPromedio);
            usuarioService.save(pasajero);

            return ResponseEntity.ok(new Mensaje("Calificación registrada exitosamente. Nuevo promedio: " + nuevoPromedio));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new Mensaje("Error al registrar la calificación: " + e.getMessage()));
        }
    }

    @PostMapping("/pasajero/calificar-conductor")
    @PreAuthorize("hasRole('PASAJERO')")
    public ResponseEntity<?> calificarConductor(@RequestBody CalificacionRequestDTO request) {
        try {
            Viaje viaje = viajeService.obtenerViajePorId(request.getViajeId());
            if (viaje == null) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("Viaje no encontrado"));
            }

            // Verificar que el viaje esté finalizado
            if (viaje.getEstado() != EstadoViaje.FINALIZADO) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("El viaje debe estar finalizado para calificar"));
            }

            Pasajero pasajero = usuarioService.obtenerPasajeroPorId(request.getPasajeroId());
            if (pasajero == null) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("Pasajero no encontrado"));
            }

            CalificacionViaje calificacion = new CalificacionViaje();
            calificacion.setViaje(viaje);
            calificacion.setPasajero(pasajero);
            calificacion.setCalificacion(request.getCalificacion());
            calificacion.setComentario(request.getComentario());
            calificacionService.guardarCalificacion(calificacion);

            // Calcular y actualizar el promedio del conductor
            double promedio = calificacionService.calcularPromedioCalificacionesConductor(viaje.getConductor().getId());
            Usuario conductor = viaje.getConductor();
            conductor.setCalificacion(promedio);
            usuarioService.save(conductor);

            return ResponseEntity.ok(new Mensaje("Calificación registrada exitosamente. Promedio actual del conductor: " + promedio));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new Mensaje("Error al registrar la calificación: " + e.getMessage()));
        }
    }
}
