package com.example.student_connect.service;

import com.example.student_connect.entity.Parada;
import com.example.student_connect.entity.ReservacionPasajero;
import com.example.student_connect.entity.Ruta;
import com.example.student_connect.repository.ReservacionPasajeroRepository;
import com.example.student_connect.security.entity.Pasajero;
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
        ReservacionPasajero reservacion = new ReservacionPasajero();
        reservacion.setPasajero(pasajero);
        reservacion.setRuta(ruta);
        reservacion.setParada(parada);
        reservacion.setTipoRuta(tipoRuta);
        reservacion.setFechaReservacion(LocalDateTime.now());
        reservacion.setConductor(ruta.getConductor());

        // Actualizar contador de pasajeros
        ruta.setNumeroPasajeros(ruta.getNumeroPasajeros() + 1);

        // Marcar parada como ocupada
        parada.setOcupado(true);

        return reservacionPasajeroRepository.save(reservacion);
    }

    public List<ReservacionPasajero> findByPasajeroAndFechaBetween(
            Integer pasajeroId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {
        return reservacionPasajeroRepository
                .findByPasajero_IdAndRuta_FechaProgramadaBetween(
                        pasajeroId,
                        fechaInicio.toLocalDate(),
                        fechaFin.toLocalDate());
    }


    public List<ReservacionPasajero> getAllReservaciones() {
        return reservacionPasajeroRepository.findAll();
    }


    public Optional<ReservacionPasajero> findByParada(Parada parada) {
        return reservacionPasajeroRepository.findByParada(parada);
    }

    public ReservacionPasajero findLatestByPasajeroId(Integer pasajeroId) {
        return reservacionPasajeroRepository
                .findFirstByPasajero_IdOrderByFechaReservacionDesc(pasajeroId);
    }

    public List<ReservacionPasajero> findAllByPasajeroId(Integer pasajeroId) {
        return reservacionPasajeroRepository.findByPasajero_IdOrderByFechaReservacionDesc(pasajeroId);
    }

    public void deleteById(Integer id) {
        reservacionPasajeroRepository.deleteById(id);
    }
}