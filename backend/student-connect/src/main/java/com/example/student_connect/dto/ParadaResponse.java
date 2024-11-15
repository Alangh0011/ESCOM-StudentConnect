package com.example.student_connect.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParadaResponse {
    private Integer paradaId;
    private String paradaNombre;
    private double costoParada;
    private double distanciaParada;
    private boolean ocupado;
    private PasajeroInfoResponse pasajero;

    // Constructor sin pasajero para las rutas públicas
    public ParadaResponse(Integer paradaId, String paradaNombre,
                          double costoParada, double distanciaParada,
                          boolean ocupado) {
        this(paradaId, paradaNombre, costoParada, distanciaParada, ocupado, null);
    }
}