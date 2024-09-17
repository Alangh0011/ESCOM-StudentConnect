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
public class RegisterRequest {
    String Nombres;
    String Apellido_Paterno;
    String Apellido_Materno;
    String Correo;
    String Boleta;
    MultipartFile fotoPerfil;
    boolean aviso_privacidad;
    String Contrasena;

}
