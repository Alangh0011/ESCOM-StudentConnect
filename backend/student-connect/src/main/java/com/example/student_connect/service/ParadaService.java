package com.example.student_connect.service;

import com.example.student_connect.entity.Parada;
import com.example.student_connect.repository.ParadaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParadaService {

    @Autowired
    private ParadaRepository paradaRepository;

    // Método para guardar una nueva parada
    public Parada saveParada(Parada parada) {
        return paradaRepository.save(parada);
    }

    // Método para obtener todas las paradas de una ruta específica
    public List<Parada> getParadasByRuta(Long rutaId) {
        return paradaRepository.findByRutaRutaId(rutaId);
    }

    // Método para eliminar paradas por ID
    public void deleteParadaById(Long id) {
        paradaRepository.deleteById(id);
    }
}
