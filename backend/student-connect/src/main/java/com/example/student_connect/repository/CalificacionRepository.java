package com.example.student_connect.repository;

import com.example.student_connect.entity.CalificacionViaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CalificacionRepository extends JpaRepository<CalificacionViaje, Integer> {

    // Obtener todas las calificaciones de un viaje
    List<CalificacionViaje> findByViajeId(Integer viajeId);

    // Contar calificaciones por pasajero
    int countByPasajeroId(Integer pasajeroId);

    // Buscar calificaciones por pasajero
    List<CalificacionViaje> findByPasajeroId(Integer pasajeroId);

    // Buscar calificaciones por conductor
    @Query("SELECT c FROM CalificacionViaje c WHERE c.viaje.conductor.id = :conductorId")
    List<CalificacionViaje> findByConductorId(@Param("conductorId") Integer conductorId);

    // También podrías agregar estos métodos adicionales si los necesitas:

    // Calcular promedio de calificaciones de un pasajero
    @Query("SELECT AVG(c.calificacion) FROM CalificacionViaje c WHERE c.pasajero.id = :pasajeroId")
    Double getAverageCalificacionByPasajeroId(@Param("pasajeroId") Integer pasajeroId);

    // Calcular promedio de calificaciones de un conductor
    @Query("SELECT AVG(c.calificacion) FROM CalificacionViaje c WHERE c.viaje.conductor.id = :conductorId")
    Double getAverageCalificacionByConductorId(@Param("conductorId") Integer conductorId);

    boolean existsByViajeIdAndPasajeroId(Integer viajeId, Integer pasajeroId);

    boolean existsByViajeIdAndPasajeroIsNotNull(Integer viajeId);

    Optional<CalificacionViaje> findByViajeIdAndPasajeroId(Integer viajeId, Integer pasajeroId);
}