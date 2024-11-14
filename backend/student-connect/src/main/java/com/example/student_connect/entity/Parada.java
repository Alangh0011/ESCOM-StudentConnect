package com.example.student_connect.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Arrays;

@Data//Para los get y sets
@Entity
@Table(name = "paradas")
public class Parada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idParadas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ruta_id", nullable = false)
    private Ruta ruta;

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

    @Column(name = "distancia_parada")
    private double distanciaParada;

    // Validación del nombre de la parada
    @AssertTrue(message = "El nombre de la parada debe ser una estación de transporte válida")
    public boolean isValidParadaNombre() {
        if (paradaNombre == null) return false;
        String[] transportesValidos = {
                "Metro", "Metrobús", "Mexibús", "Suburbano",
                "Cablebús", "Mexicable", "Trolebús"
        };
        return Arrays.stream(transportesValidos)
                .anyMatch(t -> paradaNombre.toLowerCase()
                        .contains(t.toLowerCase()));
    }

    @Column(name = "ocupado")
    private boolean ocupado = false; // Nueva columna para marcar si la parada está ocupada o no

}