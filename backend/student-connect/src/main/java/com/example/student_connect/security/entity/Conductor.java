package com.example.student_connect.security.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

@Entity
@DiscriminatorValue("CONDUCTOR")
@Table(name = "conductor")
public class Conductor extends Usuario {

    @Getter
    @Setter
    @NotBlank
    private String placas;

    @Getter
    @Setter
    @NotBlank
    private String descripcion;

    @Getter
    @Setter
    @NotBlank
    private String modelo;

    @Getter
    @Setter
    @NotBlank
    private String color;

    public Conductor(String nombre, String apellidoPaterno, String apellidoMaterno, String email, String password, int boleta, boolean avisoPrivacidad, String placas, String descripcion, String modelo, String color, String sexo) {
        super(nombre, apellidoPaterno, apellidoMaterno, email, password, boleta, avisoPrivacidad, sexo);
        this.placas = placas;
        this.descripcion = descripcion;
        this.modelo = modelo;
        this.color = color;
    }

    public Conductor() {
        // Constructor vacío para JPA
    }
}
