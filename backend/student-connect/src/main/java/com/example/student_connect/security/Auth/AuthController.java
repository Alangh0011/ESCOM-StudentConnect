package com.example.student_connect.security.Auth;

import io.jsonwebtoken.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping(value = "login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request)
    {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping(value = "register/conductor", consumes = {"multipart/form-data"})
    public ResponseEntity<AuthResponse> registerConductor(@ModelAttribute ConductorRegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.registerConductor(request));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // O maneja el error de otra manera
        }
    }


    // Método para manejar solicitudes POST a "/auth/register/pasajero".
    // Este método procesa el registro de un "Pasajero".
    // @PostMapping indica que este método debe ejecutarse cuando se realice una solicitud POST a la ruta especificada.
    // @ModelAttribute permite recibir datos de un formulario incluyendo archivos (multipart/form-data).
    @PostMapping(value = "register/pasajero", consumes = {"multipart/form-data"})
    public ResponseEntity<AuthResponse> registerPasajero(@ModelAttribute ConductorRegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.registerConductor(request));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // O maneja el error de otra manera
        }
    }
}
