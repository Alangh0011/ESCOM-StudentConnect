package com.example.student_connect.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ParadaResponse {
    private String paradaNombre;
    private double costoParada;
    private double distanciaParada;
    private boolean ocupado;

    public ParadaResponse(String paradaNombre, double costoParada, double distanciaParada, boolean ocupado) {
        this.paradaNombre = paradaNombre;
        this.costoParada = costoParada;
        this.distanciaParada = distanciaParada;
        this.ocupado = ocupado;
    }
}
