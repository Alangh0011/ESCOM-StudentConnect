package com.example.student_connect.repository;

import com.example.student_connect.entity.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface RutaRepository extends JpaRepository<Ruta, Integer> {

    @Query("SELECT DISTINCT r FROM Ruta r LEFT JOIN FETCH r.paradas " +
            "WHERE r.fechaProgramada BETWEEN :startDate AND :endDate")
    List<Ruta> findAllInFutureDateRangeForPassengers(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT DISTINCT r FROM Ruta r " +
            "LEFT JOIN FETCH r.paradas " +
            "WHERE r.conductor.id = :idConductor")
    List<Ruta> findByConductorId(@Param("idConductor") Integer idConductor);

    @Query("SELECT DISTINCT r FROM Ruta r " +
            "LEFT JOIN FETCH r.paradas " +
            "WHERE r.conductor.id = :idConductor " +
            "AND r.fechaProgramada BETWEEN :startDate AND :endDate")
    List<Ruta> findByConductorIdInFutureDateRange(
            @Param("idConductor") Integer idConductor,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT DISTINCT r FROM Ruta r LEFT JOIN FETCH r.paradas " +
            "WHERE r.fechaProgramada BETWEEN :startDate AND :endDate")
    List<Ruta> findAllInFutureDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query(value = "SELECT r FROM Ruta r WHERE r.conductor.id = :idConductor",
            countQuery = "SELECT COUNT(r) FROM Ruta r WHERE r.conductor.id = :idConductor")
    Page<Ruta> findRutasByConductorAndDate(
            @Param("idConductor") Integer idConductor,
            Pageable pageable
    );

    // Nuevo método para buscar por conductor, tipo y fecha
    @Query("SELECT r FROM Ruta r WHERE r.conductor.id = :conductorId " +
            "AND r.tipoRuta = :tipo " +
            "AND r.fechaProgramada = :fecha")
    List<Ruta> findByConductorIdAndTipoRutaAndFechaProgramada(
            @Param("conductorId") Integer conductorId,
            @Param("tipo") Character tipo,
            @Param("fecha") LocalDate fecha);

    @Query("SELECT r FROM Ruta r WHERE r.conductor.id = :conductorId " +
            "AND DATE(r.fechaProgramada) = DATE(:fecha) " +
            "AND r.estado = :estado")
    List<Ruta> findByConductorIdAndFechaProgramadaAndEstado(
            @Param("conductorId") Integer conductorId,
            @Param("fecha") LocalDate fecha,
            @Param("estado") String estado
    );

    @Query("SELECT r FROM Ruta r WHERE r.conductor.id = :conductorId " +
            "AND r.fechaProgramada >= :fechaInicio " +
            "AND r.fechaProgramada < :fechaFin " +
            "AND r.estado = :estado")
    List<Ruta> findByConductorIdAndFechaProgramadaBetweenAndEstado(
            @Param("conductorId") Integer conductorId,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("estado") String estado
    );
}
