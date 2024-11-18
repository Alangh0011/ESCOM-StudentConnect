package com.example.student_connect.entity;

import com.example.student_connect.enums.EstadoViaje;
import com.example.student_connect.security.entity.Conductor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "viajes")
public class Viaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ruta_id", nullable = false)
    private Ruta ruta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_conductor", nullable = false)
    private Conductor conductor;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoViaje estado;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @OneToMany(mappedBy = "viaje", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CalificacionViaje> calificaciones = new ArrayList<>();

    @OneToMany(mappedBy = "viaje", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UbicacionConductor> ubicaciones = new ArrayList<>();

    public void addCalificacion(CalificacionViaje calificacion) {
        calificaciones.add(calificacion);
        calificacion.setViaje(this);
    }

    public void addUbicacion(UbicacionConductor ubicacion) {
        ubicaciones.add(ubicacion);
        ubicacion.setViaje(this);
    }
    public void cambiarEstado(EstadoViaje nuevoEstado) {
        if (this.estado == EstadoViaje.PENDIENTE && nuevoEstado == EstadoViaje.EN_CURSO) {
            this.estado = nuevoEstado;
        } else if (this.estado == EstadoViaje.EN_CURSO && nuevoEstado == EstadoViaje.FINALIZADO) {
            this.estado = nuevoEstado;
        } else {
            throw new IllegalStateException("Transición de estado no permitida");
        }
    }


}
