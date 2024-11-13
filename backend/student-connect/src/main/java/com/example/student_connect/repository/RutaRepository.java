package com.example.student_connect.repository;

import com.example.student_connect.entity.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Date;
import java.util.List;

@Repository
public interface RutaRepository extends JpaRepository<Ruta, Integer> {

    @Query(value = "SELECT r FROM Ruta r WHERE r.conductor.id = :idConductor",
            countQuery = "SELECT COUNT(r) FROM Ruta r WHERE r.conductor.id = :idConductor")
    Page<Ruta> findRutasByConductorAndDate(
            @Param("idConductor") Integer idConductor,
            Pageable pageable
    );

    @Query("SELECT DISTINCT r FROM Ruta r " +
            "LEFT JOIN FETCH r.paradas " +
            "WHERE r.conductor.id = :idConductor")
    List<Ruta> findByConductorId(@Param("idConductor") Integer idConductor);

    // Otros métodos que ya tenías
    @Query("SELECT DISTINCT r FROM Ruta r " +
            "LEFT JOIN FETCH r.paradas " +
            "WHERE r.conductor.id = :idConductor " +
            "AND r.fechaPublicacion BETWEEN :startDate AND :endDate")
    List<Ruta> findByConductorIdInFutureDateRange(
            @Param("idConductor") Integer idConductor,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

    @Query("SELECT DISTINCT r FROM Ruta r LEFT JOIN FETCH r.paradas " +
            "WHERE r.fechaPublicacion BETWEEN :startDate AND :endDate")
    List<Ruta> findAllInFutureDateRange(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );
}