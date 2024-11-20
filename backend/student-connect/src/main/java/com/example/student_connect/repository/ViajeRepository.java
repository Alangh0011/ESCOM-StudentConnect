package com.example.student_connect.repository;

import com.example.student_connect.entity.Viaje;
import com.example.student_connect.enums.EstadoViaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ViajeRepository extends JpaRepository<Viaje, Integer> {

    // Nuevo método para buscar por rutaId y estado
    Viaje findByRutaRutaIdAndEstado(Integer rutaId, EstadoViaje estado);

    Viaje findFirstByRuta_RutaIdOrderByFechaInicioDesc(Integer rutaId);
    Viaje findByRuta_RutaIdAndEstado(Integer rutaId, EstadoViaje estado);


    // Obtener los viajes de un conductor programados para hoy por tipo de estado
    @Query("SELECT v FROM Viaje v WHERE v.conductor.id = :idConductor AND v.ruta.fechaProgramada = CURRENT_DATE AND v.estado = :estado")
    List<Viaje> findByConductorAndFechaProgramadaAndEstado(Integer idConductor, EstadoViaje estado);
}
