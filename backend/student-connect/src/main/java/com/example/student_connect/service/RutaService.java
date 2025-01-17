package com.example.student_connect.service;

import com.example.student_connect.entity.Parada;
import com.example.student_connect.entity.Ruta;
import com.example.student_connect.repository.RutaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.student_connect.repository.ParadaRepository;

import org.springframework.transaction.annotation.Transactional; // Cambiar esta importación

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class RutaService {
    @Autowired
    private RutaRepository rutaRepository;


    @Autowired
    private ParadaRepository paradaRepository;

    public RutaService(RutaRepository rutaRepository) {
        this.rutaRepository = rutaRepository;
    }

    public Ruta obtenerRutaPorId(Integer rutaId) {
        return rutaRepository.findById(rutaId)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada con ID: " + rutaId));
    }

    public List<Ruta> getRutasByConductorInNext7Days(Integer idConductor) {
        LocalDate fechaActual = LocalDate.now();
        LocalDate fechaLimite = fechaActual.plusDays(7);

        log.info("Consultando rutas para conductor {} entre {} y {}",
                idConductor, fechaActual, fechaLimite);

        return rutaRepository.findByConductorIdInFutureDateRange(idConductor, fechaActual, fechaLimite);
    }

    public List<Ruta> getAllRutasInNext7DaysForPassengers() {
        LocalDate fechaActual = LocalDate.now();
        LocalDate fechaLimite = fechaActual.plusDays(7);

        log.info("Consultando rutas para pasajeros entre {} y {}",
                fechaActual, fechaLimite);

        return rutaRepository.findAllInFutureDateRangeForPassengers(fechaActual, fechaLimite);
    }


    public List<Ruta> getAllRutasInNext7Days() {
        LocalDate fechaActual = LocalDate.now();
        LocalDate fechaLimite = fechaActual.plusDays(7);

        return rutaRepository.findAllInFutureDateRange(fechaActual, fechaLimite);
    }

    @Transactional(readOnly = true)
    public List<Ruta> getAllRutas() {
        try {
            log.info("Obteniendo todas las rutas");
            List<Ruta> rutas = rutaRepository.findAll();
            cargarParadasParaRutas(rutas);
            return rutas;
        } catch (Exception e) {
            log.error("Error al obtener todas las rutas: ", e);
            throw new RuntimeException("Error al obtener las rutas", e);
        }
    }


    private void cargarParadasParaRutas(List<Ruta> rutas) {
        if (rutas.isEmpty()) {
            return;
        }

        try {
            List<Integer> rutaIds = rutas.stream()
                    .map(Ruta::getRutaId)
                    .collect(Collectors.toList());

            List<Parada> paradas = paradaRepository.findByRutaRutaIdIn(rutaIds);
            Map<Integer, List<Parada>> paradasPorRuta = paradas.stream()
                    .collect(Collectors.groupingBy(p -> p.getRuta().getRutaId()));

            rutas.forEach(ruta ->
                    ruta.setParadas(paradasPorRuta.getOrDefault(ruta.getRutaId(), new ArrayList<>()))
            );
        } catch (Exception e) {
            log.error("Error al cargar paradas para rutas: ", e);
            throw new RuntimeException("Error al cargar paradas", e);
        }
    }

    // Puedes agregar un método para obtener rutas con filtros
    @Transactional(readOnly = true)
    public List<Ruta> getAllRutasWithFilters(String filtro) {
        try {
            log.info("Buscando rutas con filtro: {}", filtro);
            // Aquí podrías implementar la lógica de filtrado según tus necesidades
            List<Ruta> rutas = rutaRepository.findAll();
            if (filtro != null && !filtro.isEmpty()) {
                rutas = rutas.stream()
                        .filter(ruta ->
                                ruta.getNombreRuta().toLowerCase().contains(filtro.toLowerCase()) ||
                                        ruta.getPuntoInicioNombre().toLowerCase().contains(filtro.toLowerCase()) ||
                                        ruta.getPuntoFinalNombre().toLowerCase().contains(filtro.toLowerCase())
                        )
                        .collect(Collectors.toList());
            }
            cargarParadasParaRutas(rutas);
            return rutas;
        } catch (Exception e) {
            log.error("Error al obtener rutas con filtros: ", e);
            throw new RuntimeException("Error al filtrar rutas", e);
        }
    }

    @Transactional(readOnly = true)
    public Page<Ruta> getRutasByConductorAndDate(Integer idConductor, Pageable pageable) {
        try {
            Page<Ruta> rutasPage = rutaRepository.findRutasByConductorAndDate(idConductor, pageable);
            if (!rutasPage.getContent().isEmpty()) {
                cargarParadasParaRutas(rutasPage.getContent());
            }
            return rutasPage;
        } catch (Exception e) {
            log.error("Error al obtener rutas por conductor: ", e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<Ruta> getRutasByConductor(Integer conductorId) {
        try {
            log.info("Buscando rutas para conductor ID: {}", conductorId);
            List<Ruta> rutas = rutaRepository.findByConductorId(conductorId);
            log.info("Se encontraron {} rutas", rutas.size());

            if (!rutas.isEmpty()) {
                cargarParadasParaRutas(rutas);
            }

            return rutas;
        } catch (Exception e) {
            log.error("Error al obtener rutas por conductor: ", e);
            throw new RuntimeException("Error al obtener rutas del conductor", e);
        }
    }

    public Ruta saveRuta(Ruta ruta) {
        try {
            return rutaRepository.save(ruta);
        } catch (Exception e) {
            log.error("Error al guardar ruta: ", e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public Optional<Ruta> getRutaById(Integer id) {
        try {
            Optional<Ruta> ruta = rutaRepository.findById(id);
            ruta.ifPresent(r -> cargarParadasParaRutas(Collections.singletonList(r)));
            return ruta;
        } catch (Exception e) {
            log.error("Error al obtener ruta por ID: ", e);
            throw e;
        }
    }

    public void deleteRutaById(Integer id) {
        try {
            rutaRepository.deleteById(id);
        } catch (Exception e) {
            log.error("Error al eliminar ruta: ", e);
            throw e;
        }
    }

    public List<Ruta> getRutasByConductorAndTipoAndFecha(Integer idConductor, Character tipo, LocalDate fecha) {
        return rutaRepository.findByConductorIdAndTipoRutaAndFechaProgramada(idConductor, tipo, fecha);
    }

    public List<Ruta> getRutasByConductorAndFecha(Integer conductorId, LocalDate fecha) {
        log.info("Buscando rutas para conductor {} en fecha {}. Zona horaria del sistema: {}",
                conductorId, fecha, ZoneId.systemDefault());

        // Asegurarnos de que estamos comparando las fechas correctamente
        LocalDate inicioDelDia = fecha;
        LocalDate finDelDia = fecha.plusDays(1);

        return rutaRepository.findByConductorIdAndFechaProgramadaBetweenAndEstado(
                conductorId,
                inicioDelDia,
                finDelDia,
                "PENDIENTE"
        );
    }
}