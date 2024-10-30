package com.example.student_connect.repository;

import com.example.student_connect.entity.ReservacionPasajero;
import com.example.student_connect.security.entity.Pasajero;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservacionPasajeroRepository extends JpaRepository<ReservacionPasajero, Long> {
    boolean existsByPasajeroAndTipoRuta(Pasajero pasajero, char tipoRuta);
}
