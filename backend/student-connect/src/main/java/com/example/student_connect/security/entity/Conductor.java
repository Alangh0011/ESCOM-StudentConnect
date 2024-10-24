package com.example.student_connect.security.entity;

import javax.persistence.Entity;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

@Entity
@DiscriminatorValue("CONDUCTOR")
@Table(name = "conductor")
public class Conductor extends Usuario {

    @NotBlank
    private String placas;
    @NotBlank
    private String descripcion;
    @NotBlank
    private String modelo;
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

    // Getters y setters para las propiedades adicionales
    public String getPlacas() {
        return placas;
    }

    public void setPlacas(String placas) {
        this.placas = placas;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
