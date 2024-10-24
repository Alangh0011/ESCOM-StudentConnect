package com.example.student_connect.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data//Para los get y sets
@Entity
@Table(name = "paradas")
public class Parada {

    @NotBlank
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idParadas;

    @ManyToOne
    @JoinColumn(name = "ruta_id", nullable = false)
    private Ruta ruta; // Asociación con la ruta

    @NotBlank
    @Column(name = "parada_nombre")
    private String paradaNombre;

    @NotBlank
    @Column(name = "parada_lat")
    private double paradaLat;

    @NotBlank
    @Column(name = "parada_lng")
    private double paradaLng;

    @Column(name = "costo_parada")
    private double costoParada;
}