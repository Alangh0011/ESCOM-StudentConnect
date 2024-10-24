package com.example.student_connect.repository;

import com.example.student_connect.entity.Parada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParadaRepository extends JpaRepository<Parada, Long> {
    // Método para encontrar todas las paradas de una ruta específica
    List<Parada> findByRutaRutaId(Long rutaId);
}
