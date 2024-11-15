package com.example.student_connect.service;

import com.example.student_connect.entity.Parada;
import com.example.student_connect.entity.ReservacionPasajero;
import com.example.student_connect.entity.Ruta;
import com.example.student_connect.security.entity.Pasajero;
import com.example.student_connect.repository.ReservacionPasajeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservacionPasajeroService {

    @Autowired
    private ReservacionPasajeroRepository reservacionPasajeroRepository;

    @Transactional
    public ReservacionPasajero crearReservacion(Pasajero pasajero, Ruta ruta, Parada parada, char tipoRuta) {
        // Validaciones
        if (reservacionPasajeroRepository.existsByPasajeroAndTipoRuta(pasajero, tipoRuta)) {
            throw new IllegalStateException("El pasajero ya tiene una reserva para este tipo de ruta.");
        }

        // Crear y guardar la reservación
        ReservacionPasajero reservacion = new ReservacionPasajero();
        reservacion.setPasajero(pasajero);
        reservacion.setRuta(ruta);
        reservacion.setParada(parada);
        reservacion.setConductor(ruta.getConductor()); // Obtiene el conductor directamente desde la ruta
        reservacion.setTipoRuta(tipoRuta);

        return reservacionPasajeroRepository.save(reservacion);
    }

    public List<ReservacionPasajero> findByPasajeroAndTipoRutaAndFechaBetween(
            Integer pasajeroId,
            char tipoRuta,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    ) {
        return reservacionPasajeroRepository.findByPasajeroIdAndTipoRutaAndFechaReservacionBetween(
                pasajeroId,
                tipoRuta,
                fechaInicio,
                fechaFin
        );
    }

    public Optional<ReservacionPasajero> findByParada(Parada parada) {
        return reservacionPasajeroRepository.findByParada(parada);
    }
}