package com.example.student_connect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservacionHistorialResponse {
    private Integer reservacionId;
    private String nombreRuta;
    private String paradaNombre;
    private LocalDateTime fechaReservacion;
    private Character tipoRuta;
    private String estadoViaje;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private String nombreConductor;
    private Double calificacionConductor;
    private Double costoTotal;    // Agregado para mostrar el costo
    private Boolean calificado;   // Agregado para control de calificaciones
}