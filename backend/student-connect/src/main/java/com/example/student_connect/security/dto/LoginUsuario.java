package com.example.student_connect.security.dto;

import lombok.Getter;

import javax.validation.constraints.NotBlank;

public class LoginUsuario {

    /**
     * -- GETTER --
     *  Obtiene el email del usuario que está intentando iniciar sesión.
     *
     * @return El email del usuario que está intentando iniciar sesión.
     */
    @Getter
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    // Getters y Setters para los campos de la clase

    public void setEmail(@NotBlank String email) {
        this.email = email;
    }

    public @NotBlank String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank String password) {
        this.password = password;
    }
}
