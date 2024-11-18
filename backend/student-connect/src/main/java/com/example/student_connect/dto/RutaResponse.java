package com.example.student_connect.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
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
    Integer rutaId;
    String nombreRuta;
    int numeroPasajeros;
    int numeroParadas;
    double costoGasolina;
    String horario;
    String puntoInicioNombre;
    String puntoFinalNombre;
    LocalDate fechaProgramada;
    double distancia;
    String tiempo;
    char tipoRuta;
    List<ParadaResponse> paradas;
}
