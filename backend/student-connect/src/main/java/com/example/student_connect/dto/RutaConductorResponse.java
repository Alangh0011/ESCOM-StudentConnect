package com.example.student_connect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class RutaConductorResponse {
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
    private char tipoRuta; // Se agregó este campo
    private List<ParadaResponse> paradas;
    private String conductorNombre;
    private String conductorApellido;
    private String conductorEmail;
    private String placas;
    private String descripcion;
    private String modelo;
    private String color;

    // Constructor específico para el mapeo
    public RutaConductorResponse(Integer rutaId, String nombreRuta, int numeroPasajeros,
                                 int numeroParadas, double costoGasolina, String horario,
                                 String puntoInicioNombre, String puntoFinalNombre,
                                 Date fechaPublicacion, double distancia, String tiempo,
                                 char tipoRuta, List<ParadaResponse> paradas,
                                 String conductorNombre, String conductorApellido,
                                 String conductorEmail, String placas, String descripcion,
                                 String modelo, String color) {
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
        this.tipoRuta = tipoRuta;
        this.paradas = paradas;
        this.conductorNombre = conductorNombre;
        this.conductorApellido = conductorApellido;
        this.conductorEmail = conductorEmail;
        this.placas = placas;
        this.descripcion = descripcion;
        this.modelo = modelo;
        this.color = color;
    }
}