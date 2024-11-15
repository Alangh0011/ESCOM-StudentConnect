package com.example.student_connect.entity;

import com.example.student_connect.security.entity.Conductor;
import com.example.student_connect.security.entity.Pasajero;
import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reservacion_pasajero")
public class ReservacionPasajero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idReservacion; // Cambiar de Long a Integer

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paradas", nullable = false)
    private Parada parada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ruta_id", nullable = false)
    private Ruta ruta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_conductor", nullable = false)
    private Conductor conductor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pasajero", nullable = false)
    private Pasajero pasajero;

    @Column(name = "tipo_ruta", nullable = false)
    private char tipoRuta; // 'C' o 'E'

    @Column(name = "fecha_reservacion")
    private LocalDateTime fechaReservacion;

    // Constructor por defecto para inicializar la fecha
    @PrePersist
    private void prePersist() {
        if (fechaReservacion == null) {
            fechaReservacion = LocalDateTime.now();
        }
    }


}