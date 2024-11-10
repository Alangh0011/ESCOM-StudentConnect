package com.example.student_connect.controller;

import com.example.student_connect.dto.RutaResponse;
import com.example.student_connect.entity.Parada;
import com.example.student_connect.entity.Ruta;
import com.example.student_connect.service.ParadaService;
import com.example.student_connect.service.RutaService;
import com.example.student_connect.security.service.UsuarioService;
import com.example.student_connect.security.utils.Mensaje;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rutas")
@CrossOrigin
public class RutaController {

    @Autowired
    private RutaService rutaService;

    @Autowired
    private ParadaService paradaService;

    @Autowired
    private UsuarioService usuarioService;

    // Endpoint para registrar una nueva ruta
    @PostMapping("/nueva")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> createRuta(@RequestBody Ruta ruta) {
        System.out.println("Datos de la ruta recibidos: " + ruta);
        System.out.println("Punto inicial latitud: " + ruta.getPuntoInicioLat() + ", longitud: " + ruta.getPuntoInicioLng());
        System.out.println("Punto final latitud: " + ruta.getPuntoFinalLat() + ", longitud: " + ruta.getPuntoFinalLng());

        try {
            Ruta rutaGuardada = rutaService.saveRuta(ruta);

            // Crear la respuesta
            RutaResponse respuesta = new RutaResponse(
                    rutaGuardada.getRutaId(),
                    rutaGuardada.getPuntoFinalLat(),
                    rutaGuardada.getPuntoFinalLng(),
                    rutaGuardada.getCostoGasolina(),
                    rutaGuardada.getNumeroParadas()
            );

            return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new Mensaje("Error al crear la ruta"), HttpStatus.BAD_REQUEST);
        }
    }



    // Endpoint para obtener todas las rutas de un conductor específico
    @GetMapping("/conductor/{idConductor}")
    public ResponseEntity<List<Ruta>> getRutasByConductor(@PathVariable("idConductor") Integer idConductor) {
        try {
            List<Ruta> rutas = rutaService.getRutasByConductor(idConductor);
            return new ResponseEntity<>(rutas, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{rutaId}/paradas")
    @PreAuthorize("hasRole('CONDUCTOR')")
    public ResponseEntity<?> registrarParadas(@PathVariable Integer rutaId, @RequestBody List<Parada> paradas) {
        try {
            Ruta ruta = rutaService.getRutaById(rutaId).orElse(null);
            if (ruta == null) {
                return new ResponseEntity<>(new Mensaje("Ruta no encontrada"), HttpStatus.NOT_FOUND);
            }

            for (Parada parada : paradas) {
                parada.setRuta(ruta); // Asocia la parada a la ruta
                paradaService.saveParada(parada); // Guarda cada parada en la base de datos
            }

            return new ResponseEntity<>(new Mensaje("Paradas registradas con éxito"), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new Mensaje("Error al registrar paradas"), HttpStatus.BAD_REQUEST);
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

    // Endpoint para listar todas las rutas (opcional)
    @GetMapping("/todas")
    public ResponseEntity<List<Ruta>> getAllRutas() {
        List<Ruta> rutas = rutaService.getAllRutas();
        return new ResponseEntity<>(rutas, HttpStatus.OK);
    }
}
