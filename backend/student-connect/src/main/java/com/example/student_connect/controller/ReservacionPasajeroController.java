package com.example.student_connect.controller;

import com.example.student_connect.dto.*;
import com.example.student_connect.entity.Parada;
import com.example.student_connect.entity.ReservacionPasajero;
import com.example.student_connect.entity.Ruta;
import com.example.student_connect.entity.Viaje;
import com.example.student_connect.enums.EstadoViaje;
import com.example.student_connect.security.entity.Pasajero;
import com.example.student_connect.service.ParadaService;
import com.example.student_connect.service.ReservacionPasajeroService;
import com.example.student_connect.service.RutaService;
import com.example.student_connect.security.service.UsuarioService;
import com.example.student_connect.service.ViajeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.GetMapping;
import com.example.student_connect.security.utils.Mensaje;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequestMapping("/api/reservaciones")
public class ReservacionPasajeroController {

    @Autowired
    private ReservacionPasajeroService reservacionPasajeroService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private RutaService rutaService;

    @Autowired
    private ParadaService paradaService;

    @Autowired
    private ViajeService viajeService;


    @GetMapping("/proximos-7-dias")
    public ResponseEntity<?> getAllRutasWithConductorInNext7Days() {
        try {
            List<Ruta> rutas = rutaService.getAllRutasInNext7DaysForPassengers();

            // Obtener todas las reservaciones existentes
            List<ReservacionPasajero> reservaciones = reservacionPasajeroService.getAllReservaciones();

            // Crear un conjunto de IDs de paradas ocupadas
            Set<Integer> paradasOcupadas = reservaciones.stream()
                    .map(r -> r.getParada().getParadaId())
                    .collect(Collectors.toSet());

            // Convertir las rutas a RutaResponse sin incluir información de pasajeros
            List<RutaResponse> rutasResponses = rutas.stream()
                    .map(ruta -> new RutaResponse(
                            ruta.getRutaId(),
                            ruta.getNombreRuta(),
                            ruta.getNumeroPasajeros(),
                            ruta.getNumeroParadas(),
                            ruta.getCostoGasolina(),
                            ruta.getHorario(),
                            ruta.getPuntoInicioNombre(),
                            ruta.getPuntoFinalNombre(),
                            ruta.getFechaProgramada(),
                            ruta.getDistancia(),
                            ruta.getTiempo(),
                            ruta.getTipoRuta(),
                            ruta.getParadas().stream()
                                    .map(parada -> new ParadaResponse(
                                            parada.getParadaId(),
                                            parada.getParadaNombre(),
                                            parada.getCostoParada(),
                                            parada.getDistanciaParada(),
                                            paradasOcupadas.contains(parada.getParadaId())  // Determinar ocupación real
                                    ))
                                    .collect(Collectors.toList())
                    ))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(rutasResponses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new Mensaje("Error al obtener las rutas: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }





    @PostMapping("/crear")
    public ResponseEntity<?> crearReservacion(@RequestBody ReservacionRequest request) {
        try {
            // Validaciones básicas
            Pasajero pasajero = (Pasajero) usuarioService.getById(request.getPasajeroId())
                    .orElseThrow(() -> new IllegalArgumentException("El pasajero no existe."));

            Ruta ruta = rutaService.getRutaById(request.getRutaId())
                    .orElseThrow(() -> new IllegalArgumentException("La ruta no existe."));

            // Obtener el inicio y fin del día de la fecha programada de la ruta
            LocalDateTime startOfDay = ruta.getFechaProgramada().atStartOfDay();
            LocalDateTime endOfDay = ruta.getFechaProgramada().atTime(LocalTime.MAX);

            // Buscar reservaciones para la fecha específica de la ruta
            List<ReservacionPasajero> reservacionesDia = reservacionPasajeroService
                    .findByPasajeroAndFechaBetween(pasajero.getId(), startOfDay, endOfDay);

            char tipoRutaRequest = request.getTipoRuta().charAt(0);

            // Contar reservaciones por tipo para ese día específico
            long reservacionesC = reservacionesDia.stream()
                    .filter(r -> r.getTipoRuta() == 'C')
                    .count();
            long reservacionesE = reservacionesDia.stream()
                    .filter(r -> r.getTipoRuta() == 'E')
                    .count();

            // Validar límite por tipo para la fecha específica
            if (tipoRutaRequest == 'C' && reservacionesC >= 1) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("Ya tienes una reserva tipo C (Casa→Escuela) para el día " +
                                ruta.getFechaProgramada().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
            }
            if (tipoRutaRequest == 'E' && reservacionesE >= 1) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("Ya tienes una reserva tipo E (Escuela→Casa) para el día " +
                                ruta.getFechaProgramada().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
            }

            // Validar que el tipo de ruta coincida
            if (tipoRutaRequest != ruta.getTipoRuta()) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("El tipo de ruta solicitado '" + tipoRutaRequest +
                                "' no coincide con el tipo de la ruta '" + ruta.getTipoRuta() + "'"));
            }

            // Verificar si la parada existe y está disponible
            Parada parada = paradaService.getById(request.getParadaId())
                    .orElseThrow(() -> new IllegalArgumentException("La parada no existe."));

            Optional<ReservacionPasajero> reservacionExistente = reservacionPasajeroService.findByParada(parada);
            if (reservacionExistente.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("La parada ya está reservada"));
            }

            // Verificar límite de pasajeros
            if (ruta.getNumeroPasajeros() >= ruta.getNumeroParadas()) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("La ruta ha alcanzado su límite de pasajeros"));
            }

            // Crear la reservación
            ReservacionPasajero nuevaReservacion = reservacionPasajeroService.crearReservacion(
                    pasajero,
                    ruta,
                    parada,
                    tipoRutaRequest
            );

            // Actualizar estado de paradas
            paradaService.sincronizarEstadoOcupacion();

            return ResponseEntity.ok(new Mensaje("Reserva creada correctamente para el día " +
                    ruta.getFechaProgramada().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));

        } catch (Exception e) {
            log.error("Error al crear reservación:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Mensaje("Error al crear la reserva: " + e.getMessage()));
        }
    }

    @GetMapping("/viaje-activo/{pasajeroId}")
    public ResponseEntity<?> getViajeActivoPasajero(@PathVariable Integer pasajeroId) {
        try {
            log.info("Buscando viaje activo para pasajero ID: {}", pasajeroId);

            ReservacionPasajero reservacion = reservacionPasajeroService
                    .findLatestByPasajeroId(pasajeroId);

            if (reservacion == null) {
                log.info("No se encontró reservación para el pasajero ID: {}", pasajeroId);
                return ResponseEntity.ok(null);
            }

            log.info("Reservación encontrada: {}", reservacion.getIdReservacion());

            Viaje viajeActivo = viajeService
                    .findByRutaIdAndEstado(reservacion.getRuta().getRutaId(), EstadoViaje.EN_CURSO);

            if (viajeActivo == null) {
                log.info("No se encontró viaje EN_CURSO para la ruta ID: {}",
                        reservacion.getRuta().getRutaId());
                return ResponseEntity.ok(null);
            }

            log.info("Viaje activo encontrado: {}", viajeActivo.getId());

            // Aquí actualizamos la creación del response con todos los campos
            ViajeActivoResponse response = new ViajeActivoResponse(
                    viajeActivo.getId(),
                    viajeActivo.getRuta().getRutaId(),
                    viajeActivo.getRuta().getNombreRuta(),
                    viajeActivo.getEstado().toString(),
                    viajeActivo.getConductor().getNombre(),
                    viajeActivo.getConductor().getCalificacion(),
                    reservacion.getParada().getParadaNombre(),
                    viajeActivo.getRuta().getPuntoInicioLat(),
                    viajeActivo.getRuta().getPuntoInicioLng(),
                    viajeActivo.getRuta().getPuntoFinalLat(),
                    viajeActivo.getRuta().getPuntoFinalLng(),
                    viajeActivo.getFechaInicio(),
                    viajeActivo.getFechaFin(),
                    reservacion.getParada().getDistanciaParada(),
                    reservacion.getParada().getCostoParada(),
                    false // Por defecto no está calificado
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error al obtener viaje activo para pasajero ID {}: {}",
                    pasajeroId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Mensaje("Error al obtener viaje activo: " + e.getMessage()));
        }
    }

    @GetMapping("/historial/{pasajeroId}")
    public ResponseEntity<?> getHistorialReservaciones(@PathVariable Integer pasajeroId) {
        try {
            log.info("Obteniendo historial de reservaciones para pasajero ID: {}", pasajeroId);

            List<ReservacionPasajero> reservaciones = reservacionPasajeroService
                    .findAllByPasajeroId(pasajeroId);

            List<ReservacionHistorialResponse> response = reservaciones.stream()
                    .map(reservacion -> {
                        Viaje viaje = viajeService
                                .findByRutaId(reservacion.getRuta().getRutaId());

                        return new ReservacionHistorialResponse(
                                reservacion.getIdReservacion(),
                                reservacion.getRuta().getNombreRuta(),
                                reservacion.getParada().getParadaNombre(),
                                reservacion.getFechaReservacion(),
                                reservacion.getTipoRuta(),
                                viaje != null ? viaje.getEstado().toString() : "PENDIENTE",
                                viaje != null ? viaje.getFechaInicio() : null,
                                viaje != null ? viaje.getFechaFin() : null,
                                viaje != null ? viaje.getConductor().getNombre() : "Sin asignar",
                                viaje != null ? viaje.getConductor().getCalificacion() : 0.0,
                                reservacion.getParada().getCostoParada(), // Costo de la parada
                                false // Por defecto no está calificado
                        );
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al obtener historial: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Mensaje("Error al obtener historial: " + e.getMessage()));
        }
    }
}
