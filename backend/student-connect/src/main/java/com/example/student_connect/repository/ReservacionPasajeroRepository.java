package com.example.student_connect.repository;

import com.example.student_connect.entity.ReservacionPasajero;
import com.example.student_connect.entity.Parada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservacionPasajeroRepository extends JpaRepository<ReservacionPasajero, Integer> {

    List<ReservacionPasajero> findByPasajero_IdAndFechaReservacionBetween(
            Integer pasajeroId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin);

    List<ReservacionPasajero> findByPasajero_IdAndRuta_FechaProgramadaBetween(
            Integer pasajeroId,
            LocalDate fechaInicio,
            LocalDate fechaFin
    );

    Optional<ReservacionPasajero> findByParada(Parada parada);

    ReservacionPasajero findFirstByPasajero_IdOrderByFechaReservacionDesc(Integer pasajeroId);

    List<ReservacionPasajero> findByPasajero_IdOrderByFechaReservacionDesc(Integer pasajeroId);
}