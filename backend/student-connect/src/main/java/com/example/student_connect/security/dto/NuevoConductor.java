package com.example.student_connect.security.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class NuevoConductor {

    @NotBlank
    @Getter
    @Setter
    private String nombre;

    @NotBlank
    @Getter
    @Setter
    private String apellidoPaterno;

    @NotBlank
    @Getter
    @Setter
    private String apellidoMaterno;

    @NotBlank
    @Email
    @Getter
    @Setter
    private String email;

    @NotBlank
    @Getter
    @Setter
    private String password;

    @NotNull
    @Getter
    @Setter
    private int boleta;

    @NotNull
    @Getter
    @Setter
    private boolean avisoPrivacidad;

    @NotBlank
    @Getter
    @Setter
    private String placas;

    @NotBlank
    @Getter
    @Setter
    private String descripcion;

    @NotBlank
    @Getter
    @Setter
    private String modelo;

    @NotBlank
    @Getter
    @Setter
    private String color;

    @NotBlank
    @Getter
    @Setter
    private String sexo;
}
