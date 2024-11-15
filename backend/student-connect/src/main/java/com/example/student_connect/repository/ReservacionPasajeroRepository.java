package com.example.student_connect.repository;

import com.example.student_connect.entity.Parada;
import com.example.student_connect.entity.ReservacionPasajero;
import com.example.student_connect.security.entity.Pasajero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservacionPasajeroRepository extends JpaRepository<ReservacionPasajero, Integer> {
    boolean existsByPasajeroAndTipoRuta(Pasajero pasajero, char tipoRuta);

    List<ReservacionPasajero> findByPasajeroIdAndTipoRutaAndFechaReservacionBetween(
            Integer pasajeroId,
            char tipoRuta,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );
    Optional<ReservacionPasajero> findByParada(Parada parada);
}