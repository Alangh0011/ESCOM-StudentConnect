package com.example.student_connect.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private char tipoRuta;
    private List<ParadaResponse> paradas;
}
