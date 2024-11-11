package com.example.student_connect.dto;

import com.example.student_connect.entity.Parada;
import lombok.Data;

import java.util.List;

@Data
public class RutaResponse {

    private Integer rutaId;
    private double puntoInicioLat;
    private double puntoInicioLng;
    private double puntoFinalLat;
    private double puntoFinalLng;
    private char tipoRuta;
    private double costoGasolina;
    private int numeroParadas;

    // Constructor completo con todos los campos
    public RutaResponse(Integer rutaId, double puntoInicioLat, double puntoInicioLng, double puntoFinalLat, double puntoFinalLng, char tipoRuta, double costoGasolina, int numeroParadas) {
        this.rutaId = rutaId;
        this.puntoInicioLat = puntoInicioLat;
        this.puntoInicioLng = puntoInicioLng;
        this.puntoFinalLat = puntoFinalLat;
        this.puntoFinalLng = puntoFinalLng;
        this.tipoRuta = tipoRuta;
        this.costoGasolina = costoGasolina;
        this.numeroParadas = numeroParadas;
    }
}
