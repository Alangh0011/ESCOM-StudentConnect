package com.example.student_connect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViajeActivoResponse {
    private Integer viajeId;
    private Integer rutaId;
    private String nombreRuta;
    private String estado;
    private String nombreConductor;
    private Double calificacionConductor;
    private String paradaNombre;
    private Double puntoInicioLat;
    private Double puntoInicioLng;
    private Double puntoFinalLat;
    private Double puntoFinalLng;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Double distanciaParada;
    private Double costoParada;
    private Boolean calificado;
}