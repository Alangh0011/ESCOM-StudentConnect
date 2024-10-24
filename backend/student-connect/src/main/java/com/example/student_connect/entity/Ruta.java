package com.example.student_connect.entity;


import com.example.student_connect.security.entity.Conductor;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.List;

@Data//Para los get y sets
@Entity
@Table(name = "rutas")
public class Ruta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rutaId;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Conductor conductor; // Asociación con el conductor que publica la ruta

    @NotBlank
    @Column(name = "fecha_publicacion")
    private Date fechaPublicacion;

    @Column(name = "numero_pasajeros")
    private int numeroPasajeros;

    @NotBlank
    @Column(name = "numero_paradas")
    private int numeroParadas;

    @NotBlank
    @Column(name = "costo_gasolina")
    private double costoGasolina;

    private double costo;

    @Column(name = "tipo_ruta")
    private char tipoRuta;
    // C; casa a escuela
    // E; escuela a casa

    private String horario;

    @OneToMany(mappedBy = "ruta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Parada> paradas; // Hasta 4 paradas asociadas a esta ruta
}
