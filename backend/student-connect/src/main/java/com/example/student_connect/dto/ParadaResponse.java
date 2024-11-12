package com.example.student_connect.dto;

import lombok.Data;

@Data
public class ParadaResponse {

    private String paradaNombre;
    private double costoParada;

    // Constructor
    public ParadaResponse(String paradaNombre, double costoParada) {
        this.paradaNombre = paradaNombre;
        this.costoParada = costoParada;
    }
}