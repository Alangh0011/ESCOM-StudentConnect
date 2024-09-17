package com.example.student_connect.security.Auth;

// Importaciones de las anotaciones de Lombok
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Anotaciones de Lombok para reducir el código repetitivo
@Data // Genera automáticamente getters, setters, toString, equals, y hashCode.
@Builder // Proporciona un patrón de diseño Builder para construir objetos de esta clase.
@AllArgsConstructor // Genera un constructor con todos los campos como argumentos.
@NoArgsConstructor  // Genera un constructor sin argumentos.
public class LoginRequest {

    // Campos requeridos para la solicitud de inicio de sesión
    String username; // Nombre de usuario o correo electrónico proporcionado por el usuario
    String password; // Contraseña proporcionada por el usuario
}
