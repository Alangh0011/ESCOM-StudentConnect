package com.example.student_connect.dto;

import com.example.student_connect.entity.Parada;
import lombok.Data;

import java.util.List;

@Data
public class RutaResponse {

    private Integer rutaId;
    private double puntoInicioLat;
    private double puntoInicioLng;
    private double costoGasolina;
    private int numeroParadas;

    public RutaResponse(Integer rutaId, double puntoInicioLat, double puntoInicioLng, double costoGasolina, int numeroParadas) {
        this.rutaId = rutaId;
        this.puntoInicioLat = puntoInicioLat;
        this.puntoInicioLng = puntoInicioLng;
        this.costoGasolina = costoGasolina;
        this.numeroParadas = numeroParadas;
    }
}
