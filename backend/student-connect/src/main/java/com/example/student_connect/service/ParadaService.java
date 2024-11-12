package com.example.student_connect.service;

import com.example.student_connect.entity.Parada;
import com.example.student_connect.repository.ParadaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ParadaService {

    @Autowired
    private ParadaRepository paradaRepository;

    public Parada saveParada(Parada parada) {
        return paradaRepository.save(parada);
    }

    // Cambiado el tipo de Long a Integer
    public List<Parada> getParadasByRuta(Integer rutaId) {
        return paradaRepository.findByRutaRutaId(rutaId);
    }

    public void deleteParadaById(Integer id) {
        paradaRepository.deleteById(id);
    }

    public Optional<Parada> getById(Integer id) {
        return paradaRepository.findById(id);
    }

    // Método adicional para obtener paradas por múltiples IDs de ruta
    public List<Parada> getParadasByRutaIds(Collection<Integer> rutaIds) {
        return paradaRepository.findByRutaRutaIdIn(rutaIds);
    }
}