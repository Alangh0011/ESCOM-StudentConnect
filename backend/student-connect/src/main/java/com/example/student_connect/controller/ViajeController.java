package com.example.student_connect.controller;

import com.example.student_connect.dto.ParadaResponse;
import com.example.student_connect.dto.PasajeroInfoResponse;
import com.example.student_connect.dto.ViajeRequestDTO;
import com.example.student_connect.dto.ViajeResponseDTO;
import com.example.student_connect.entity.ReservacionPasajero;
import com.example.student_connect.entity.Ruta;
import com.example.student_connect.entity.UbicacionConductor;
import com.example.student_connect.entity.Viaje;
import com.example.student_connect.enums.EstadoViaje;
import com.example.student_connect.security.entity.Pasajero;
import com.example.student_connect.security.service.UsuarioService;
import com.example.student_connect.security.utils.Mensaje;
import com.example.student_connect.service.ParadaService;
import com.example.student_connect.service.ReservacionPasajeroService;
import com.example.student_connect.service.UbicacionConductorService;  // Agregar este servicio
import com.example.student_connect.service.RutaService;
import com.example.student_connect.service.ViajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;  // Asegúrate de que esta importación esté presente
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Slf4j  // <- Esta anotación está presente
@RequestMapping("/api/viajes")
public class ViajeController {

    @Autowired
    private ViajeService viajeService;
    @Autowired
    private RutaService rutaService;

    @Autowired
    private UbicacionConductorService ubicacionConductorService; // Correcto

    @Autowired
    private ReservacionPasajeroService reservacionPasajeroService; // Agregar este servicio



    // Endpoint para iniciar un viaje
    @PostMapping("/iniciar")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> iniciarViaje(@RequestBody ViajeRequestDTO request) {
        if (request.getRutaId() == null) {
            return ResponseEntity.badRequest().body(new Mensaje("El ID de la ruta no puede ser nulo."));
        }

        Ruta ruta = rutaService.obtenerRutaPorId(request.getRutaId());
        if (ruta == null) {
            return ResponseEntity.badRequest().body(new Mensaje("Ruta no encontrada con ID: " + request.getRutaId()));
        }

        // Crear un nuevo viaje
        Viaje nuevoViaje = new Viaje();
        nuevoViaje.setRuta(ruta);
        nuevoViaje.setEstado(EstadoViaje.EN_CURSO);
        nuevoViaje.setFechaInicio(LocalDateTime.now());
        nuevoViaje.setConductor(ruta.getConductor());
        Viaje viajeGuardado = viajeService.guardarViaje(nuevoViaje);

        // Crear un registro inicial en ubicacion_conductor
        UbicacionConductor ubicacionInicial = new UbicacionConductor();
        ubicacionInicial.setViaje(viajeGuardado);
        ubicacionInicial.setLat(0.0); // Valor inicial o predeterminado
        ubicacionInicial.setLng(0.0); // Valor inicial o predeterminado
        ubicacionInicial.setTimestamp(LocalDateTime.now());
        UbicacionConductor ubicacionGuardada = ubicacionConductorService.guardarUbicacionInicial(ubicacionInicial);

        // Retornar respuesta con los datos del viaje iniciado
        return ResponseEntity.ok(Map.of(
                "viajeId", viajeGuardado.getId(),
                "rutaId", ruta.getRutaId(),
                "ubicacionConductorId", ubicacionGuardada.getId(), // Opcional
                "nombreRuta", ruta.getNombreRuta(),
                "fechaInicio", viajeGuardado.getFechaInicio(),
                "estado", viajeGuardado.getEstado().name()
        ));
    }


    @GetMapping("/conductor/{idConductor}/rutas-hoy/{tipo}")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> getRutasHoyPorTipo(
            @PathVariable Integer idConductor,
            @PathVariable Character tipo
    ) {
        try {
            if (tipo != 'E' && tipo != 'C') {
                return new ResponseEntity<>(
                        new Mensaje("Tipo de ruta inválido. Debe ser 'E' o 'C'"),
                        HttpStatus.BAD_REQUEST
                );
            }

            LocalDate hoy = LocalDate.now();
            List<Ruta> rutas = rutaService.getRutasByConductorAndTipoAndFecha(
                    idConductor,
                    tipo,
                    hoy
            );

            // Obtener todas las reservaciones existentes
            List<ReservacionPasajero> reservaciones = reservacionPasajeroService.getAllReservaciones();

            // Convertir a ViajeResponseDTO con información de pasajeros y coordenadas
            List<ViajeResponseDTO> response = rutas.stream()
                    .map(ruta -> {
                        List<PasajeroInfoResponse> pasajerosInfo = ruta.getParadas().stream()
                                .flatMap(parada -> reservaciones.stream()
                                        .filter(reservacion ->
                                                reservacion.getParada().getParadaId().equals(parada.getParadaId()) &&
                                                        reservacion.getRuta().getRutaId().equals(ruta.getRutaId()) &&
                                                        reservacion.getPasajero() != null
                                        )
                                        .map(reservacion -> {
                                            Pasajero pasajero = reservacion.getPasajero();
                                            return new PasajeroInfoResponse(
                                                    pasajero.getId(),
                                                    pasajero.getNombre(),
                                                    pasajero.getApellidoPaterno(),
                                                    pasajero.getBoleta()
                                            );
                                        })
                                )
                                .distinct()
                                .collect(Collectors.toList());

                        return new ViajeResponseDTO(
                                ruta.getRutaId(),
                                ruta.getNombreRuta(),
                                ruta.getFechaProgramada().atStartOfDay(),
                                ruta.getEstado(),
                                pasajerosInfo,
                                ruta.getNumeroParadas(),
                                ruta.getPuntoInicioLat(),
                                ruta.getPuntoInicioLng(),
                                ruta.getPuntoFinalLat(),
                                ruta.getPuntoFinalLng(),
                                ruta.getPuntoInicioNombre(),
                                ruta.getPuntoFinalNombre()
                        );
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al obtener viajes del día para conductor ID: {}: {}",
                    idConductor, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Mensaje("Error al obtener los viajes: " + e.getMessage()));
        }
    }



    // Endpoint para finalizar un viaje
    @PostMapping("/finalizar")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> finalizarViaje(@RequestBody ViajeRequestDTO request) {
        Viaje viaje = viajeService.finalizarViaje(request.getViajeId());
        return ResponseEntity.ok("Viaje finalizado con éxito: " + viaje.getId());
    }

    // En ViajeController.java
    @PostMapping("/{viajeId}/notificar-fin")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> notificarFinViaje(@PathVariable Integer viajeId) {
        try {
            Viaje viaje = viajeService.obtenerViajePorId(viajeId);
            if (viaje == null) {
                return ResponseEntity.notFound().build();
            }

            // Validar estado
            if (viaje.getEstado() != EstadoViaje.EN_CURSO) {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("El viaje no está en curso"));
            }

            // Actualizar estado del viaje
            viaje.cambiarEstado(EstadoViaje.FINALIZADO);
            viaje.setFechaFin(LocalDateTime.now());
            viajeService.guardarViaje(viaje);

            return ResponseEntity.ok(new Mensaje("Viaje finalizado exitosamente"));
        } catch (Exception e) {
            log.error("Error al finalizar viaje {}: {}", viajeId, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new Mensaje("Error al finalizar el viaje"));
        }
    }

}
