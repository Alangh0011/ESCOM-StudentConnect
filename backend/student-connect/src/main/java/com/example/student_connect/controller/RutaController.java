package com.example.student_connect.controller;

import com.example.student_connect.dto.*;
import com.example.student_connect.entity.Parada;
import com.example.student_connect.entity.Ruta;
import com.example.student_connect.service.ParadaService;
import com.example.student_connect.service.ReservacionPasajeroService;
import com.example.student_connect.service.RutaService;
import com.example.student_connect.security.utils.Mensaje;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;  // Añadir esta importación
import com.example.student_connect.security.entity.Usuario;
import com.example.student_connect.security.service.UsuarioService;
import com.example.student_connect.entity.ReservacionPasajero;
import com.example.student_connect.service.ReservacionPasajeroService;
import com.example.student_connect.security.entity.Pasajero;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rutas")
@CrossOrigin
@Slf4j  // Añadir esta anotación
public class RutaController {

    @Autowired
    private RutaService rutaService;

    @Autowired
    private ParadaService paradaService;

    @Autowired
    private UsuarioService usuarioService; // Asegúrate de inyectar UsuarioService aquí

    @Autowired
    private ReservacionPasajeroService reservacionPasajeroService; // Agregar este servicio


    public RutaController(RutaService rutaService) {
        this.rutaService = rutaService;
    }

    // Obtener rutas de un conductor en los próximos 7 días
    @GetMapping("/conductor/{idConductor}/proximos-7-dias")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> getRutasByConductorInNext7Days(@PathVariable("idConductor") Integer idConductor) {
        try {
            // Obtener fecha actual y fecha límite (7 días después)
            LocalDate fechaActual = LocalDate.now();
            LocalDate fechaLimite = fechaActual.plusDays(7);

            log.info("Buscando rutas para conductor {} entre {} y {}",
                    idConductor, fechaActual, fechaLimite);

            // Obtener rutas dentro del rango de fechas
            List<Ruta> rutas = rutaService.getRutasByConductorInNext7Days(idConductor);

            // Filtrar rutas por fecha
            rutas = rutas.stream()
                    .filter(ruta -> {
                        LocalDate fechaRuta = ruta.getFechaProgramada();
                        return !fechaRuta.isBefore(fechaActual) && !fechaRuta.isAfter(fechaLimite);
                    })
                    .collect(Collectors.toList());

            // Obtener todas las reservaciones existentes
            List<ReservacionPasajero> reservaciones = reservacionPasajeroService.getAllReservaciones();

            // Crear mapa de paradaId -> ReservacionPasajero
            Map<Integer, ReservacionPasajero> reservacionesPorParada = reservaciones.stream()
                    .collect(Collectors.toMap(
                            r -> r.getParada().getParadaId(),
                            r -> r,
                            (r1, r2) -> r1 // En caso de duplicados, mantener el primero
                    ));

            // Convertir a RutaResponse
            List<RutaResponse> rutaResponses = rutas.stream()
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
                                    .map(parada -> {
                                        ReservacionPasajero reservacion =
                                                reservacionesPorParada.get(parada.getParadaId());

                                        PasajeroInfoResponse pasajeroInfo = null;
                                        if (reservacion != null && reservacion.getPasajero() != null) {
                                            Pasajero pasajero = reservacion.getPasajero();
                                            pasajeroInfo = new PasajeroInfoResponse(
                                                    pasajero.getId(),
                                                    pasajero.getNombre(),
                                                    pasajero.getApellidoPaterno(),
                                                    pasajero.getBoleta()
                                            );
                                        }

                                        return new ParadaResponse(
                                                parada.getParadaId(),
                                                parada.getParadaNombre(),
                                                parada.getCostoParada(),
                                                parada.getDistanciaParada(),
                                                reservacion != null,
                                                pasajeroInfo
                                        );
                                    })
                                    .collect(Collectors.toList())
                    ))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(rutaResponses, HttpStatus.OK);

        } catch (Exception e) {
            log.error("Error al obtener rutas para conductor {}: {}", idConductor, e.getMessage());
            return new ResponseEntity<>(
                    new Mensaje("Error al obtener las rutas: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping("/proximos-7-dias")
    public ResponseEntity<?> getAllRutasInNext7Days() {
        try {
            List<Ruta> rutas = rutaService.getAllRutasInNext7Days();

            // Convertir la lista de entidades Ruta a RutaResponse para enviar solo los datos esenciales
            List<RutaResponse> rutaResponses = rutas.stream()
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
                                            parada.isOcupado()
                                    ))
                                    .collect(Collectors.toList())
                    ))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(rutaResponses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new Mensaje("Error al obtener las rutas: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Endpoint para registrar una nueva ruta
    @PostMapping("/nueva")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> createRuta(@RequestBody Ruta ruta) {
        try {
            // Establece el estado predeterminado si no se proporciona
            if (ruta.getEstado() == null) {
                ruta.setEstado("PENDIENTE");
            }

            Ruta rutaGuardada = rutaService.saveRuta(ruta);

            RutaDetalleResponse respuesta = new RutaDetalleResponse(
                    rutaGuardada.getRutaId(),
                    rutaGuardada.getNombreRuta(),
                    rutaGuardada.getNumeroPasajeros(),
                    rutaGuardada.getNumeroParadas(),
                    rutaGuardada.getCostoGasolina(),
                    rutaGuardada.getTipoRuta(),
                    rutaGuardada.getHorario(),
                    rutaGuardada.getPuntoInicioNombre(),
                    rutaGuardada.getPuntoFinalNombre(),
                    rutaGuardada.getPuntoInicioLat(),
                    rutaGuardada.getPuntoInicioLng(),
                    rutaGuardada.getPuntoFinalLat(),
                    rutaGuardada.getPuntoFinalLng(),
                    rutaGuardada.getFechaProgramada(), // Usar fechaProgramada en lugar de fechaPublicacion
                    rutaGuardada.getDistancia(),
                    rutaGuardada.getTiempo(),
                    rutaGuardada.getEstado(), // Añadir estado aquí
                    new ArrayList<>()
            );

            return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new Mensaje("Error al crear la ruta: " + e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }



    @PostMapping("/{rutaId}/actualizarDistancia")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> actualizarDistanciaTotal(@PathVariable Integer rutaId, @RequestBody ActualizarDistanciaRequest request) {
        try {
            Optional<Ruta> optionalRuta = rutaService.getRutaById(rutaId);
            if (!optionalRuta.isPresent()) {
                return new ResponseEntity<>(new Mensaje("Ruta no encontrada"), HttpStatus.NOT_FOUND);
            }

            Ruta ruta = optionalRuta.get();
            ruta.setDistancia(request.getDistancia()); // Usa el valor de distancia del objeto request
            rutaService.saveRuta(ruta); // Guarda los cambios en la base de datos

            return new ResponseEntity<>(new Mensaje("Distancia total actualizada correctamente"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new Mensaje("Error al actualizar la distancia total"), HttpStatus.BAD_REQUEST);
        }
    }


    // Endpoint para obtener las rutas de un conductor por ID
    @GetMapping("/conductor/{idConductor}/todas-rutas")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> getAllRutasByConductor(@PathVariable("idConductor") Integer idConductor) {
        try {
            List<Ruta> rutas = rutaService.getRutasByConductor(idConductor);

            List<RutaResponse> rutaResponses = rutas.stream()
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
                                            parada.isOcupado()
                                    ))
                                    .collect(Collectors.toList())
                    ))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(rutaResponses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new Mensaje("Error al obtener las rutas: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping("/conductor/{idConductor}")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> getRutasConductor(@PathVariable("idConductor") Integer idConductor) {
        try {
            log.info("Obteniendo rutas para conductor ID: {}", idConductor);
            List<Ruta> rutas = rutaService.getRutasByConductor(idConductor);

            if (rutas.isEmpty()) {
                log.info("No se encontraron rutas para el conductor ID: {}", idConductor);
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<RutaResponse> rutaResponses = rutas.stream()
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
                                            parada.isOcupado()
                                    ))
                                    .collect(Collectors.toList())
                    ))
                    .collect(Collectors.toList());

            log.info("Se encontraron {} rutas para el conductor ID: {}", rutaResponses.size(), idConductor);
            return ResponseEntity.ok(rutaResponses);
        } catch (Exception e) {
            log.error("Error al obtener rutas para conductor ID: " + idConductor, e);
            return new ResponseEntity<>(
                    new Mensaje("Error al obtener las rutas: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    // Endpoint para registrar paradas en una ruta
    @PostMapping("/{rutaId}/paradas")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> registrarParadas(@PathVariable Integer rutaId,
                                              @RequestBody List<Parada> paradas) {
        try {
            if (paradas == null || paradas.isEmpty()) {
                return new ResponseEntity<>(new Mensaje("No se proporcionaron paradas"),
                        HttpStatus.BAD_REQUEST);
            }

            Optional<Ruta> rutaOpt = rutaService.getRutaById(rutaId);
            if (!rutaOpt.isPresent()) {
                return new ResponseEntity<>(new Mensaje("Ruta no encontrada"),
                        HttpStatus.NOT_FOUND);
            }

            Ruta ruta = rutaOpt.get();

            // Validar que el número de paradas coincida con lo especificado en la ruta
            if (paradas.size() != ruta.getNumeroParadas()) {
                return new ResponseEntity<>(
                        new Mensaje("El número de paradas (" + paradas.size() +
                                ") no coincide con lo especificado en la ruta (" +
                                ruta.getNumeroParadas() + ")"),
                        HttpStatus.BAD_REQUEST);
            }

            // Validar que no existan paradas previas
            List<Parada> paradasExistentes = paradaService.getParadasByRuta(rutaId);
            if (!paradasExistentes.isEmpty()) {
                return new ResponseEntity<>(
                        new Mensaje("Esta ruta ya tiene paradas registradas"),
                        HttpStatus.BAD_REQUEST);
            }

            for (Parada parada : paradas) {
                if (!parada.isValidParadaNombre()) {
                    return new ResponseEntity<>(
                            new Mensaje("Nombre de parada inválido: " + parada.getParadaNombre()),
                            HttpStatus.BAD_REQUEST);
                }
                parada.setRuta(ruta);

                // Logs...
            }

            // Guardar las paradas
            List<Parada> paradasGuardadas = paradas.stream()
                    .map(paradaService::saveParada)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(
                    new Mensaje("Se registraron exitosamente " + paradasGuardadas.size() + " paradas"),
                    HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new Mensaje("Error al registrar las paradas: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // Endpoint para eliminar una ruta por ID
    @DeleteMapping("/{rutaId}")
    @PreAuthorize("hasRole('CONDUCTOR')")
    @Transactional
    public ResponseEntity<?> deleteRuta(@PathVariable("rutaId") Integer rutaId) {
        try {
            log.info("Iniciando eliminación de ruta ID: {}", rutaId);
            Optional<Ruta> optionalRuta = rutaService.getRutaById(rutaId);
            if (!optionalRuta.isPresent()) {
                log.warn("Ruta no encontrada: {}", rutaId);
                return new ResponseEntity<>(new Mensaje("Ruta no encontrada"), HttpStatus.NOT_FOUND);
            }

            Ruta ruta = optionalRuta.get();
            Integer idConductor = ruta.getConductor().getId(); // Obtener el ID del conductor de la ruta
            log.info("Ruta encontrada. Paradas asociadas: {}", ruta.getParadas().size());

            // Primero eliminar las reservaciones asociadas a las paradas
            for (Parada parada : ruta.getParadas()) {
                Optional<ReservacionPasajero> reservacion = reservacionPasajeroService.findByParada(parada);
                if (reservacion.isPresent()) {
                    reservacionPasajeroService.deleteById(reservacion.get().getIdReservacion());
                }
            }

            // Eliminar la ruta
            rutaService.deleteRutaById(rutaId);
            log.info("Ruta eliminada exitosamente");

            // Actualizar calificación del conductor
            Optional<Usuario> optionalConductor = usuarioService.findById(idConductor);
            if (optionalConductor.isPresent()) {
                Usuario conductor = optionalConductor.get();
                double nuevaCalificacion = Math.max(0, conductor.getCalificacion() - 0.2);
                conductor.setCalificacion(nuevaCalificacion);
                usuarioService.save(conductor);
            }

            return new ResponseEntity<>(new Mensaje("Ruta eliminada correctamente"), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error al eliminar ruta: ", e);
            return new ResponseEntity<>(new Mensaje("Error al eliminar la ruta"), HttpStatus.BAD_REQUEST);
        }
    }



}
