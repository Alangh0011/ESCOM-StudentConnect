package com.example.student_connect.security.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class NuevoPasajero {

    @NotBlank
    @Getter
    @Setter
    private String nombre;

    @NotBlank
    @Getter
    @Setter
    private String apellidoPaterno;

    @Getter
    @Setter
    @NotBlank
    private String apellidoMaterno;

    @Getter
    @Setter
    @NotBlank
    @Email
    private String email;

    @Getter
    @Setter
    @NotBlank
    private String password;

    @Getter
    @Setter
    @NotNull
    private int boleta;

    @Setter
    @Getter
    @NotNull
    private boolean avisoPrivacidad;

    @NotBlank
    @Setter
    @Getter
    private String sexo;

    // Getters y Setters para los campos de la clase

}
