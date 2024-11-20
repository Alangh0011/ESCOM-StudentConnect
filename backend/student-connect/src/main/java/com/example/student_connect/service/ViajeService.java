package com.example.student_connect.service;

import com.example.student_connect.entity.Viaje;
import com.example.student_connect.enums.EstadoViaje;
import com.example.student_connect.repository.ViajeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.student_connect.service.RutaService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class ViajeService {

    @Autowired
    private ViajeRepository viajeRepository;

    @Autowired
    private RutaService rutaService;

    // Obtener viajes del conductor para hoy
    public List<Viaje> getViajesDelDia(Integer idConductor, EstadoViaje estado) {
        return viajeRepository.findByConductorAndFechaProgramadaAndEstado(idConductor, estado);
    }

    // Iniciar un viaje
    public Viaje iniciarViaje(Integer rutaId) {
        try {
            Viaje viaje = new Viaje();
            viaje.setRuta(rutaService.obtenerRutaPorId(rutaId));
            viaje.setEstado(EstadoViaje.EN_CURSO);
            viaje.setFechaInicio(LocalDateTime.now());

            Viaje viajeGuardado = viajeRepository.save(viaje);
            log.info("Viaje iniciado correctamente: ID={}, Estado={}",
                    viajeGuardado.getId(), viajeGuardado.getEstado());

            return viajeGuardado;
        } catch (Exception e) {
            log.error("Error al iniciar viaje para ruta {}: {}", rutaId, e.getMessage());
            throw e;
        }
    }

    // Finalizar un viaje
    public Viaje finalizarViaje(Integer viajeId) {
        Viaje viaje = viajeRepository.findById(viajeId)
                .orElseThrow(() -> new RuntimeException("Viaje no encontrado con ID: " + viajeId));

        if (viaje.getEstado() != EstadoViaje.EN_CURSO) {
            throw new IllegalStateException("Solo se pueden finalizar viajes en curso");
        }

        viaje.setEstado(EstadoViaje.FINALIZADO);
        viaje.setFechaFin(LocalDateTime.now());
        return viajeRepository.save(viaje);
    }
    // Método para obtener un viaje por ID
    public Viaje obtenerViajePorId(Integer viajeId) {
        return viajeRepository.findById(viajeId)
                .orElseThrow(() -> new IllegalArgumentException("El viaje con ID " + viajeId + " no existe"));
    }

    public Viaje guardarViaje(Viaje viaje) {
        return viajeRepository.save(viaje);
    }


    public Viaje findByRutaId(Integer rutaId) {
        // Buscar el viaje más reciente para esta ruta
        return viajeRepository.findFirstByRuta_RutaIdOrderByFechaInicioDesc(rutaId);
    }

    public Viaje findByRutaIdAndEstado(Integer rutaId, EstadoViaje estado) {
        return viajeRepository.findByRuta_RutaIdAndEstado(rutaId, estado);
    }
}
