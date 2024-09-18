package com.example.student_connect.security.Auth;

import com.example.student_connect.security.User.User;
import com.example.student_connect.security.User.UsuarioRepositoryCustom;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.student_connect.security.Jwt.JwtService;
import com.example.student_connect.security.User.Role;
import com.example.student_connect.security.User.Conductor;

import java.io.IOException;
import java.util.Base64;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UsuarioRepositoryCustom userRepositoryCustom;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getContrasena()));
        UserDetails user = userRepositoryCustom.findByCorreo(request.getCorreo()).orElseThrow();
        String token = jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    public AuthResponse registerConductor(ConductorRegisterRequest request) throws IOException {
        String fotoPerfilBase64 = null;
        if (request.getFotoPerfil() != null && !request.getFotoPerfil().isEmpty()) {
            byte[] bytes = request.getFotoPerfil().getBytes();
            fotoPerfilBase64 = Base64.getEncoder().encodeToString(bytes); // Convertir a Base64
        }

        Conductor conductor = Conductor.builder()
                .correo(request.getCorreo())
                .Contrasena(passwordEncoder.encode(request.getContrasena()))
                .Nombres(request.getNombres())
                .Apellido_Paterno(request.getApellido_Paterno())
                .Apellido_Materno(request.getApellido_Materno())
                .Boleta(request.getBoleta())
                .fotoBase64(fotoPerfilBase64) // Pasar la cadena Base64
                .aviso_privacidad(false)
                .role(Role.CONDUCTOR)
                .Placas(request.getPlacas())
                .Descripcion(request.getDescripcion())
                .Modelo(request.getModelo())
                .Color(request.getColor())
                .build();

        userRepositoryCustom.save(conductor);

        return AuthResponse.builder()
                .token(jwtService.getToken(conductor))
                .build();
    }

    public AuthResponse registerPasajero(PasajeroRegisterRequest request) throws IOException {
        String fotoPerfilBase64 = null;
        if (request.getFotoPerfil() != null && !request.getFotoPerfil().isEmpty()) {
            byte[] bytes = request.getFotoPerfil().getBytes();
            fotoPerfilBase64 = Base64.getEncoder().encodeToString(bytes); // Convertir a Base64
        }

        User user = User.builder()
                .correo(request.getCorreo())
                .Contrasena(passwordEncoder.encode(request.getContrasena()))
                .Nombres(request.getNombres())
                .Apellido_Paterno(request.getApellido_Paterno())
                .Apellido_Materno(request.getApellido_Materno())
                .Boleta(request.getBoleta())
                .fotoBase64(fotoPerfilBase64) // Pasar la cadena Base64
                .role(Role.PASAJERO)
                .build();

        userRepositoryCustom.save(user);

        return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .build();
    }
}