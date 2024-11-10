package com.example.student_connect.service;

import com.example.student_connect.entity.Ruta;
import com.example.student_connect.repository.RutaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RutaService {

    @Autowired
    private RutaRepository rutaRepository;

    // Método para guardar una nueva ruta
    public Ruta saveRuta(Ruta ruta) {
        return rutaRepository.save(ruta);
    }


    // Método para obtener todas las rutas
    public List<Ruta> getAllRutas() {
        return rutaRepository.findAll();
    }

    // Método para obtener todas las rutas de un conductor específico
    public List<Ruta> getRutasByConductor(Integer conductorId) {
        return rutaRepository.findByConductorId(conductorId);
    }

    // Método para obtener una ruta por su ID
    public Optional<Ruta> getRutaById(Integer id) {
        return rutaRepository.findById(id);
    }

    // Método para actualizar una ruta existente
    public Ruta updateRuta(Ruta ruta) {
        return rutaRepository.save(ruta);
    }

    // Método para eliminar una ruta por ID
    public void deleteRutaById(Integer id) {
        rutaRepository.deleteById(id);
    }

    public Optional<Ruta> getById(Integer id) {
        return rutaRepository.findById(id);
    }
}
