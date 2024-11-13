package com.example.student_connect.dto;

import com.example.student_connect.security.entity.Conductor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
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
    private List<ParadaResponse> paradas;

    // Datos del conductor
    private String conductorNombre;
    private String conductorApellido;
    private String conductorEmail;
    private String vehiculoPlacas;
    private String vehiculoDescripcion;
    private String vehiculoModelo;
    private String vehiculoColor;

    // Constructor para inicializar todos los campos
    public RutaConductorResponse(
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
            List<ParadaResponse> paradas,
            String conductorNombre,
            String conductorApellido,
            String conductorEmail,
            String vehiculoPlacas,
            String vehiculoDescripcion,
            String vehiculoModelo,
            String vehiculoColor) {
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
        this.conductorNombre = conductorNombre;
        this.conductorApellido = conductorApellido;
        this.conductorEmail = conductorEmail;
        this.vehiculoPlacas = vehiculoPlacas;
        this.vehiculoDescripcion = vehiculoDescripcion;
        this.vehiculoModelo = vehiculoModelo;
        this.vehiculoColor = vehiculoColor;
    }
}
