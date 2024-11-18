package com.example.student_connect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class ViajeResponseDTO {
    private Integer rutaId;
    private String nombreRuta;
    private LocalDateTime fechaProgramada;
    private String estado;
    private List<PasajeroInfoResponse> pasajeros;
    private Integer numeroParadas;
    // Coordenadas de inicio y fin
    private Double puntoInicioLat;
    private Double puntoInicioLng;
    private Double puntoFinalLat;
    private Double puntoFinalLng;
    private String puntoInicioNombre;
    private String puntoFinalNombre;

    // Constructor completo
    public ViajeResponseDTO(
            Integer rutaId,
            String nombreRuta,
            LocalDateTime fechaProgramada,
            String estado,
            List<PasajeroInfoResponse> pasajeros,
            Integer numeroParadas,
            Double puntoInicioLat,
            Double puntoInicioLng,
            Double puntoFinalLat,
            Double puntoFinalLng,
            String puntoInicioNombre,
            String puntoFinalNombre
    ) {
        this.rutaId = rutaId;
        this.nombreRuta = nombreRuta;
        this.fechaProgramada = fechaProgramada;
        this.estado = estado;
        this.pasajeros = pasajeros;
        this.numeroParadas = numeroParadas;
        this.puntoInicioLat = puntoInicioLat;
        this.puntoInicioLng = puntoInicioLng;
        this.puntoFinalLat = puntoFinalLat;
        this.puntoFinalLng = puntoFinalLng;
        this.puntoInicioNombre = puntoInicioNombre;
        this.puntoFinalNombre = puntoFinalNombre;
    }

    // Constructor para mantener compatibilidad con código existente
    public ViajeResponseDTO(
            Integer rutaId,
            String nombreRuta,
            LocalDateTime fechaProgramada,
            String estado,
            List<PasajeroInfoResponse> pasajeros,
            Integer numeroParadas
    ) {
        this(rutaId, nombreRuta, fechaProgramada, estado, pasajeros, numeroParadas,
                null, null, null, null, null, null);
    }
}