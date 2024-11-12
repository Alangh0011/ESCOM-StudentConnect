package com.example.student_connect.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

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
    private char tipoRuta;
    private String horario;
    private String puntoInicioNombre;
    private String puntoFinalNombre;
    private double puntoInicioLat;
    private double puntoInicioLng;
    private double puntoFinalLat;
    private double puntoFinalLng;
    private Date fechaPublicacion;
    private List<ParadaResponse> paradas;

    // Constructor para la creación de ruta
    public RutaResponse(
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
            Date fechaPublicacion,
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
        this.paradas = paradas;
        this.fechaPublicacion = fechaPublicacion;
    }

    // Constructor para la lista de rutas
    public RutaResponse(
            int rutaId,
            String nombreRuta,
            int numeroPasajeros,
            int numeroParadas,
            double costoGasolina,
            char tipoRuta,
            String horario,
            String puntoInicioNombre,
            String puntoFinalNombre,
            Date fechaPublicacion,
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
        this.paradas = paradas;
        this.fechaPublicacion = fechaPublicacion;
    }
}