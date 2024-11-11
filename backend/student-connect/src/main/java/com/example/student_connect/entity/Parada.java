package com.example.student_connect.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data//Para los get y sets
@Entity
@Table(name = "paradas")
public class Parada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idParadas;

    @ManyToOne
    @JoinColumn(name = "ruta_id", nullable = false)
    private Ruta ruta; // Asociación con la ruta

    @NotBlank
    @Column(name = "parada_nombre")
    private String paradaNombre;

    @NotNull
    @Column(name = "parada_lat")
    private double paradaLat;

    @NotNull
    @Column(name = "parada_lng")
    private double paradaLng;

    @Column(name = "costo_parada")
    private double costoParada;

    @Column(name = "tiempo")
    private String tiempo; // tiempo aproximado de la ruta

    @Column(name = "distancia")
    private String distancia; // distancia aproximado de la ruta
}