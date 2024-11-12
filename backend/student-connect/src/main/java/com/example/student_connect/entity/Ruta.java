package com.example.student_connect.entity;

import com.example.student_connect.security.entity.Conductor;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data // Para los getters y setters
@Entity
@Table(name = "rutas")
public class Ruta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rutaId;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Conductor conductor; // Asociación con el conductor que publica la ruta

    @NotBlank
    @Column(name = "nombre_ruta")
    private String nombreRuta; // Nombre de la ruta

    @NotBlank
    @Column(name = "fecha_publicacion")
    private Date fechaPublicacion;

    @Column(name = "numero_pasajeros")
    private int numeroPasajeros;

    @Column(name = "numero_paradas")
    private int numeroParadas;

    @NotBlank
    @Column(name = "costo_gasolina")
    private double costoGasolina;

    @Column(name = "tipo_ruta")
    private char tipoRuta; // C; casa a escuela, E; escuela a casa

    @Column(name = "horario")
    private String horario;

    @Column(name = "puntoInicioNombre")
    private String puntoInicioNombre ;

    @Column(name = "puntoFinalNombre")
    private String puntoFinalNombre;

    @Column(name = "punto_inicio_lat")
    private double puntoInicioLat; // Latitud del punto de inicio

    @Column(name = "punto_inicio_lng")
    private double puntoInicioLng; // Longitud del punto de inicio

    @Column(name = "punto_final_lat")
    private double puntoFinalLat; // Latitud del punto final

    @Column(name = "punto_final_lng")
    private double puntoFinalLng; // Longitud del punto final

    @Column(name = "tiempo")
    private String tiempo; // tiempo aproximado de la ruta

    @Column(name = "distancia")
    private double distancia; // distancia aproximado de la ruta

    @OneToMany(mappedBy = "ruta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Parada> paradas = new ArrayList<>();

    public void setParadas(List<Parada> paradas) {
        this.paradas = paradas;
        // Mantener la bidireccionalidad
        if (paradas != null) {
            paradas.forEach(parada -> parada.setRuta(this));
        }
    }

}
