package com.example.student_connect.controller;

import com.example.student_connect.dto.*;
import com.example.student_connect.entity.Parada;
import com.example.student_connect.entity.ReservacionPasajero;
import com.example.student_connect.entity.Ruta;
import com.example.student_connect.security.entity.Pasajero;
import com.example.student_connect.service.ParadaService;
import com.example.student_connect.service.ReservacionPasajeroService;
import com.example.student_connect.service.RutaService;
import com.example.student_connect.security.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.GetMapping;
import com.example.student_connect.security.utils.Mensaje;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
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


    @GetMapping("/proximos-7-dias")
    public ResponseEntity<?> getAllRutasWithConductorInNext7Days() {
        try {
            List<Ruta> rutas = rutaService.getAllRutasInNext7Days();

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
                            ruta.getFechaPublicacion(),
                            ruta.getDistancia(),
                            ruta.getTiempo(),
                            ruta.getTipoRuta(),
                            ruta.getParadas().stream()
                                    .map(parada -> {
                                        // Buscar la reservación asociada a esta parada
                                        Optional<ReservacionPasajero> reservacionOpt =
                                                reservacionPasajeroService.findByParada(parada);

                                        // Crear PasajeroInfoResponse si hay reservación
                                        PasajeroInfoResponse pasajeroInfo = null;
                                        if (reservacionOpt.isPresent() && reservacionOpt.get().getPasajero() != null) {
                                            Pasajero pasajero = reservacionOpt.get().getPasajero();
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
                                                parada.isOcupado(),
                                                pasajeroInfo
                                        );
                                    })
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
            // Obtención de entidades
            Pasajero pasajero = (Pasajero) usuarioService.getById(request.getPasajeroId().intValue())
                    .orElseThrow(() -> new IllegalArgumentException("El pasajero no existe."));
            Ruta ruta = rutaService.getRutaById(request.getRutaId().intValue())
                    .orElseThrow(() -> new IllegalArgumentException("La ruta no existe."));
            Parada parada = paradaService.getById(request.getParadaId().intValue())
                    .orElseThrow(() -> new IllegalArgumentException("La parada no existe."));

            // Verificar si la parada ya está ocupada
            if (parada.isOcupado()) {
                return new ResponseEntity<>(new Mensaje("La parada ya está ocupada"), HttpStatus.BAD_REQUEST);
            }

            // Convertir el tipo de ruta de String a char
            char tipoRutaRequest = request.getTipoRuta().charAt(0);

            // Validar que el tipo de ruta coincida
            if (tipoRutaRequest != ruta.getTipoRuta()) {
                return new ResponseEntity<>(
                        new Mensaje("El tipo de ruta solicitado '" + tipoRutaRequest +
                                "' no coincide con el tipo de la ruta '" + ruta.getTipoRuta() + "'"),
                        HttpStatus.BAD_REQUEST
                );
            }

            // Verificar si el usuario ya tiene una reserva del mismo tipo hoy
            LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
            LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

            List<ReservacionPasajero> reservacionesHoy = reservacionPasajeroService
                    .findByPasajeroAndTipoRutaAndFechaBetween(
                            pasajero.getId(),
                            tipoRutaRequest, // Usar la variable convertida
                            startOfDay,
                            endOfDay
                    );

            if (!reservacionesHoy.isEmpty()) {
                return new ResponseEntity<>(
                        new Mensaje("Ya tienes una reserva del tipo " + tipoRutaRequest + " para hoy"),
                        HttpStatus.BAD_REQUEST
                );
            }

            // Verificar si no excede el número de paradas disponibles
            if (ruta.getNumeroPasajeros() >= ruta.getNumeroParadas()) {
                return new ResponseEntity<>(
                        new Mensaje("La ruta ha alcanzado su límite de pasajeros"),
                        HttpStatus.BAD_REQUEST
                );
            }

            // Incrementar el número de pasajeros de la ruta
            ruta.setNumeroPasajeros(ruta.getNumeroPasajeros() + 1);

            // Marcar la parada como ocupada
            parada.setOcupado(true);

            // Guardar la actualización de la ruta y la parada
            rutaService.saveRuta(ruta);
            paradaService.saveParada(parada);

            // Crear y guardar la reservación usando el char convertido
            ReservacionPasajero nuevaReservacion = reservacionPasajeroService.crearReservacion(
                    pasajero,
                    ruta,
                    parada,
                    tipoRutaRequest
            );

            return new ResponseEntity<>(
                    new Mensaje("Reserva creada correctamente"),
                    HttpStatus.CREATED
            );

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new Mensaje("Error al crear la reserva: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}
