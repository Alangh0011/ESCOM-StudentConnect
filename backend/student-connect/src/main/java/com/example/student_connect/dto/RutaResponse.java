package com.example.student_connect.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class RutaResponse {
    private Integer rutaId;
    private String nombreRuta;
    private int numeroPasajeros;
    private int numeroParadas;
    private double costoGasolina;
    private String horario;
    private String puntoInicioNombre;
    private String puntoFinalNombre;
    private Date fechaPublicacion;
    private double distancia;
    private String tiempo;
    private List<ParadaResponse> paradas;

    // Constructor reducido
    public RutaResponse(
            Integer rutaId,
            String nombreRuta,
            int numeroPasajeros,
            int numeroParadas,
            double costoGasolina,
            String horario,
            String puntoInicioNombre,
            String puntoFinalNombre,
            Date fechaPublicacion,
            double distancia,
            String tiempo,
            List<ParadaResponse> paradas) {
        this.rutaId = rutaId;
        this.nombreRuta = nombreRuta;
        this.numeroPasajeros = numeroPasajeros;
        this.numeroParadas = numeroParadas;
        this.costoGasolina = costoGasolina;
        this.horario = horario;
        this.puntoInicioNombre = puntoInicioNombre;
        this.puntoFinalNombre = puntoFinalNombre;
        this.fechaPublicacion = fechaPublicacion;
        this.distancia = distancia;
        this.tiempo = tiempo;
        this.paradas = paradas;
    }
}
