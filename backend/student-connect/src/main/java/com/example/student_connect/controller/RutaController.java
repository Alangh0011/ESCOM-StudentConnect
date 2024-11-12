package com.example.student_connect.controller;

import com.example.student_connect.dto.ActualizarDistanciaRequest;
import com.example.student_connect.dto.ParadaResponse;
import com.example.student_connect.dto.RutaResponse;
import com.example.student_connect.entity.Parada;
import com.example.student_connect.entity.Ruta;
import com.example.student_connect.service.ParadaService;
import com.example.student_connect.service.RutaService;
import com.example.student_connect.security.service.UsuarioService;
import com.example.student_connect.security.utils.Mensaje;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;  // Añadir esta importación


import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
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


    // Endpoint para registrar una nueva ruta
    @PostMapping("/nueva")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> createRuta(@RequestBody Ruta ruta) {
        try {
            Ruta rutaGuardada = rutaService.saveRuta(ruta);

            // Usar el constructor con todos los campos
            RutaResponse respuesta = new RutaResponse(
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
                    rutaGuardada.getFechaPublicacion(),
                    new ArrayList<>()
            );

            return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new Mensaje("Error al crear la ruta: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
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
                            ruta.getTipoRuta(),
                            ruta.getHorario(),
                            ruta.getPuntoInicioNombre(),
                            ruta.getPuntoFinalNombre(),
                            ruta.getFechaPublicacion(),
                            ruta.getParadas().stream()
                                    .map(parada -> new ParadaResponse(parada.getParadaNombre(), parada.getCostoParada()))
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
                            ruta.getTipoRuta(),
                            ruta.getHorario(),
                            ruta.getPuntoInicioNombre(),
                            ruta.getPuntoFinalNombre(),
                            ruta.getFechaPublicacion(),
                            ruta.getParadas().stream()
                                    .map(parada -> new ParadaResponse(
                                            parada.getParadaNombre(),
                                            parada.getCostoParada()
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
    public ResponseEntity<?> deleteRuta(@PathVariable("rutaId") Integer rutaId) {
        try {
            rutaService.deleteRutaById(rutaId);
            return new ResponseEntity<>(new Mensaje("Ruta eliminada correctamente"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new Mensaje("Error al eliminar la ruta"), HttpStatus.BAD_REQUEST);
        }
    }

}
