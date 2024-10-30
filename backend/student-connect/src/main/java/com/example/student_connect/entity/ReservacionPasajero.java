package com.example.student_connect.entity;

import com.example.student_connect.security.entity.Conductor;
import com.example.student_connect.security.entity.Pasajero;
import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "reservacion_pasajero")
public class ReservacionPasajero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReservacion;

    @ManyToOne
    @JoinColumn(name = "id_paradas", nullable = false)
    private Parada parada; // Parada seleccionada por el pasajero

    @ManyToOne
    @JoinColumn(name = "ruta_id", nullable = false)
    private Ruta ruta; // Ruta seleccionada

    @ManyToOne
    @JoinColumn(name = "id_pasajero", nullable = false)
    private Pasajero pasajero; // Pasajero que realiza la reservación

    @ManyToOne
    @JoinColumn(name = "id_conductor", nullable = false)
    private Conductor conductor; // Conductor asociado a la ruta

    @Column(name = "tipo_ruta", nullable = false)
    private char tipoRuta; // 'C' o 'E'
}
