package com.example.student_connect.controller;

import com.example.student_connect.entity.Parada;
import com.example.student_connect.entity.Ruta;
import com.example.student_connect.service.ParadaService;
import com.example.student_connect.service.RutaService;
import com.example.student_connect.security.entity.Conductor;
import com.example.student_connect.security.service.UsuarioService;
import com.example.student_connect.security.utils.Mensaje;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> createRuta(@RequestBody Ruta ruta) {
        try {
            rutaService.saveRuta(ruta);
            return new ResponseEntity<>(new Mensaje("Ruta creada correctamente"), HttpStatus.CREATED);
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

    // Endpoint para agregar paradas a una ruta específica
    @PostMapping("/{rutaId}/paradas")
    public ResponseEntity<?> addParadaToRuta(@PathVariable("rutaId") Integer rutaId, @RequestBody Parada parada) {
        Optional<Ruta> rutaOpt = rutaService.getRutaById(rutaId);
        if (rutaOpt.isPresent()) {
            Ruta ruta = rutaOpt.get();
            parada.setRuta(ruta);
            paradaService.saveParada(parada);
            return new ResponseEntity<>(new Mensaje("Parada agregada correctamente"), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(new Mensaje("Ruta no encontrada"), HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para eliminar una ruta por ID
    @DeleteMapping("/{rutaId}")
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
