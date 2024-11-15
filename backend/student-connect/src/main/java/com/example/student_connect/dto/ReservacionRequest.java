package com.example.student_connect.dto;

import lombok.Data;

@Data
public class ReservacionRequest {
    private Long pasajeroId;
    private Long rutaId;
    private Long paradaId;
    private String tipoRuta;


}