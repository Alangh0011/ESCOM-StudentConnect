package com.example.student_connect.security.dto;

import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor

public class NuevoConductor {

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellidoPaterno;

    @NotBlank
    private String apellidoMaterno;

    @NotBlank
    @Email
    private String email;

    double calificacion;

    @NotBlank
    private String password;

    @NotNull
    private int boleta;

    @NotNull
    private boolean avisoPrivacidad;

    @NotBlank

    private String placas;

    @NotBlank
    private String descripcion;

    @NotBlank
    private String modelo;

    @NotBlank
    private String color;

    @NotBlank
    private String sexo;
}
