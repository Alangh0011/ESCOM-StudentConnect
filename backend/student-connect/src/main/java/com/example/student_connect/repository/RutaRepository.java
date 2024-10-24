package com.example.student_connect.repository;

import com.example.student_connect.entity.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RutaRepository extends JpaRepository<Ruta, Long> {
    // Método para encontrar todas las rutas de un conductor específico por su id
    List<Ruta> findByConductorId(Long idUsuario);
}