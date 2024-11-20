package com.example.student_connect.dto;

import lombok.Data;

@Data
public class ReservacionRequest {
    private Integer pasajeroId;  // Cambiado de Long a Integer
    private Integer rutaId;      // Cambiado de Long a Integer
    private Integer paradaId;    // Cambiado de Long a Integer
    private String tipoRuta;
}