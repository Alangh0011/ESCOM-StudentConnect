package com.example.student_connect.entity;

import com.example.student_connect.security.entity.Pasajero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "calificacion_viaje")
public class CalificacionViaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "viaje_id", nullable = false)
    private Viaje viaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pasajero", nullable = false)
    private Pasajero pasajero;

    @Column(nullable = false)
    @Min(1)
    @Max(5)
    private double calificacion;



    @Column(length = 255)
    private String comentario;

    @Column(name = "fecha_calificacion", nullable = false)
    private LocalDateTime fechaCalificacion;

    @Column(name = "fecha_actualizacion")
    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;

    @Column(name = "fecha_creacion", updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @PrePersist
    private void prePersist() {
        this.fechaCalificacion = LocalDateTime.now();
    }
}

