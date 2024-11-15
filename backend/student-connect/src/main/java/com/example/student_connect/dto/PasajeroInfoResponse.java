package com.example.student_connect.dto;

import lombok.Data;

@Data
public class PasajeroInfoResponse {
    private Integer id;
    private String nombre;
    private String apellidoPaterno;
    private int boleta;

    public PasajeroInfoResponse(Integer id, String nombre, String apellidoPaterno, int boleta) {
        this.id = id;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.boleta = boleta;
    }
}