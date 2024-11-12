package com.example.student_connect.repository;

import com.example.student_connect.entity.Parada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Collection;

@Repository
public interface ParadaRepository extends JpaRepository<Parada, Integer> {
    // Cambiado a Integer para coincidir con el tipo de ID en la entidad Ruta
    List<Parada> findByRutaRutaId(Integer rutaId);

    // Método para buscar paradas por múltiples IDs de ruta
    List<Parada> findByRutaRutaIdIn(Collection<Integer> rutaIds);
}