package com.example.student_connect.dto;

import lombok.Data;

@Data
public class ParadaResponse {

    private String paradaNombre;
    private double costoParada;
    private double distanciaParada;

    // Constructor
    public ParadaResponse(String paradaNombre, double costoParada, double distanciaParada) {
        this.paradaNombre = paradaNombre;
        this.costoParada = costoParada;
        this.distanciaParada = distanciaParada;
    }
}