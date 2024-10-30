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
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/crear")
    public ResponseEntity<?> crearReservacion(@RequestBody ReservacionRequest request) {

        // Obtención de entidades
        Pasajero pasajero = (Pasajero) usuarioService.getById(request.getPasajeroId())
                .orElseThrow(() -> new IllegalArgumentException("El pasajero no existe."));
        Ruta ruta = rutaService.getById(request.getRutaId())
                .orElseThrow(() -> new IllegalArgumentException("La ruta no existe."));
        Parada parada = paradaService.getById(request.getParadaId())
                .orElseThrow(() -> new IllegalArgumentException("La parada no existe."));


        // Creación de la reservación
        ReservacionPasajero reservacion = reservacionPasajeroService.crearReservacion(pasajero, ruta, parada, request.getTipoRuta());
        return new ResponseEntity<>(reservacion, HttpStatus.CREATED);
    }
}

