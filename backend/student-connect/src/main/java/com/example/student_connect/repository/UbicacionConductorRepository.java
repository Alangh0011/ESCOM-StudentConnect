package com.example.student_connect.repository;

import com.example.student_connect.entity.UbicacionConductor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UbicacionConductorRepository extends JpaRepository<UbicacionConductor, Integer> {
    Optional<UbicacionConductor> findTopByViajeIdOrderByTimestampDesc(Integer viajeId);
    // Método para eliminar todas las ubicaciones asociadas a un viaje
    void deleteByViajeId(Integer viajeId);
}