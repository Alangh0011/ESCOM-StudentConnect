package com.example.student_connect.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ubicacion_conductor", indexes = {
        @Index(name = "idx_viaje_timestamp", columnList = "viaje_id,timestamp DESC")
})
public class UbicacionConductor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "viaje_id", nullable = false)
    private Viaje viaje;

    @Column(nullable = false)
    private double lat;

    @Column(nullable = false)
    private double lng;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void prePersist() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }

    // Constructor para crear/actualizar ubicación
    public UbicacionConductor(Viaje viaje, double lat, double lng) {
        this.viaje = viaje;
        this.lat = lat;
        this.lng = lng;
        this.timestamp = LocalDateTime.now();
    }

    // Métodos para actualizar la ubicación
    public void actualizarUbicacion(double lat, double lng) {
        this.lat = lat;
        this.lng = lng;
        this.timestamp = LocalDateTime.now();
    }
}