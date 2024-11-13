package com.example.student_connect.controller;

import com.example.student_connect.dto.ReservacionRequest;
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

import com.example.student_connect.dto.ParadaResponse;
import com.example.student_connect.dto.RutaConductorResponse;
import org.springframework.web.bind.annotation.GetMapping;
import com.example.student_connect.security.utils.Mensaje;

import java.util.List;
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

            // Convierte las entidades Ruta a DTOs RutaConductorResponse
            List<RutaConductorResponse> rutaConductorResponses = rutas.stream()
                    .map(ruta -> new RutaConductorResponse(
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
                            ruta.getParadas().stream()
                                    .map(parada -> new ParadaResponse(
                                            parada.getParadaNombre(),
                                            parada.getCostoParada(),
                                            parada.getDistanciaParada()
                                    ))
                                    .collect(Collectors.toList()),
                            ruta.getConductor().getNombre(),
                            ruta.getConductor().getApellidoPaterno(),
                            ruta.getConductor().getEmail(),
                            ruta.getConductor().getPlacas(),
                            ruta.getConductor().getDescripcion(),
                            ruta.getConductor().getModelo(),
                            ruta.getConductor().getColor()
                    ))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(rutaConductorResponses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new Mensaje("Error al obtener las rutas: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearReservacion(@RequestBody ReservacionRequest request) {

        // Obtención de entidades
        Pasajero pasajero = (Pasajero) usuarioService.getById(request.getPasajeroId())
                .orElseThrow(() -> new IllegalArgumentException("El pasajero no existe."));
        Ruta ruta = rutaService.getRutaById(request.getRutaId())
                .orElseThrow(() -> new IllegalArgumentException("La ruta no existe."));
        Parada parada = paradaService.getById(request.getParadaId())
                .orElseThrow(() -> new IllegalArgumentException("La parada no existe."));


        // Creación de la reservación
        ReservacionPasajero reservacion = reservacionPasajeroService.crearReservacion(pasajero, ruta, parada, request.getTipoRuta());
        return new ResponseEntity<>(reservacion, HttpStatus.CREATED);
    }
}

