package com.example.student_connect.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class RutaDetalleResponse {
    private Integer rutaId;
    private String nombreRuta;
    private int numeroPasajeros;
    private int numeroParadas;
    private double costoGasolina;
    private char tipoRuta;
    private String horario;
    private String puntoInicioNombre;
    private String puntoFinalNombre;
    private double puntoInicioLat;
    private double puntoInicioLng;
    private double puntoFinalLat;
    private double puntoFinalLng;
    private LocalDate fechaProgramada;
    private double distancia;
    private String tiempo;
    private String estado; // Nuevo campo
    private List<ParadaResponse> paradas;

    // Constructor completo
    public RutaDetalleResponse(
            Integer rutaId,
            String nombreRuta,
            int numeroPasajeros,
            int numeroParadas,
            double costoGasolina,
            char tipoRuta,
            String horario,
            String puntoInicioNombre,
            String puntoFinalNombre,
            double puntoInicioLat,
            double puntoInicioLng,
            double puntoFinalLat,
            double puntoFinalLng,
            LocalDate fechaProgramada,
            double distancia,
            String tiempo,
            String estado, // Nuevo campo
            List<ParadaResponse> paradas) {
        this.rutaId = rutaId;
        this.nombreRuta = nombreRuta;
        this.numeroPasajeros = numeroPasajeros;
        this.numeroParadas = numeroParadas;
        this.costoGasolina = costoGasolina;
        this.tipoRuta = tipoRuta;
        this.horario = horario;
        this.puntoInicioNombre = puntoInicioNombre;
        this.puntoFinalNombre = puntoFinalNombre;
        this.puntoInicioLat = puntoInicioLat;
        this.puntoInicioLng = puntoInicioLng;
        this.puntoFinalLat = puntoFinalLat;
        this.puntoFinalLng = puntoFinalLng;
        this.fechaProgramada = fechaProgramada;
        this.distancia = distancia;
        this.tiempo = tiempo;
        this.estado = estado; // Asigna el estado aquí
        this.paradas = paradas;
    }
}

