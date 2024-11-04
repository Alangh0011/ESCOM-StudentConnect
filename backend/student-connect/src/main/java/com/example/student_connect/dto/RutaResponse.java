package com.example.student_connect.dto;

import com.example.student_connect.entity.Parada;
import lombok.Data;

import java.util.List;

@Data
public class RutaResponse {

    private Integer rutaId;
    private double puntoFinalLat;
    private double puntoFinalLng;
    private double costoGasolina;
    private int numeroParadas;

    public RutaResponse(Integer rutaId, double puntoFinalLat, double puntoFinalLng, double costoGasolina, int numeroParadas) {
        this.rutaId = rutaId;
        this.puntoFinalLat = puntoFinalLat;
        this.puntoFinalLng = puntoFinalLng;
        this.costoGasolina = costoGasolina;
        this.numeroParadas = numeroParadas;
    }
}
