package com.example.student_connect.security.Auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConductorRegisterRequest {
    String Nombres;
    String Apellido_Paterno;
    String Apellido_Materno;
    String Correo;
    int Boleta;
    MultipartFile fotoPerfil;
    boolean aviso_privacidad;
    String Contrasena;

    // Campos adicionales para conductores
    String Placas;
    String Descripcion;
    String Modelo;
    String Color;
}