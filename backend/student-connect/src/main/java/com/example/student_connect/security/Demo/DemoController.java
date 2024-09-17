package com.example.student_connect.security.Demo;

// Importaciones necesarias para el funcionamiento del controlador
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

// La anotación @RestController indica que esta clase es un controlador de Spring, que manejará las solicitudes HTTP y devolverá respuestas.
// La anotación @RequestMapping establece el prefijo "/api/v1" para todas las rutas de esta clase.
// La anotación @RequiredArgsConstructor genera un constructor con todos los campos finales (final), aunque en este caso no hay campos declarados.
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DemoController {

    // Método para manejar solicitudes POST a "/api/v1/demo".
    // @PostMapping indica que este método debe ejecutarse cuando se realice una solicitud POST a la ruta especificada.
    public String welcome() {
        // Retorna un mensaje de bienvenida.
        // En un contexto real, este endpoint podría estar protegido por una configuración de seguridad,
        // permitiendo el acceso solo a usuarios autenticados o con ciertos roles.
        return "Welcome from secure endpoint";
    }
}
