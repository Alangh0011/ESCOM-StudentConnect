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
    private FileStorageService fileStorageService;
    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails user = userRepositoryCustom.findByCorreo(request.getUsername()).orElseThrow();
        String token=jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();

    }

    public AuthResponse registerConductor(ConductorRegisterRequest request) {
        // Crear nuevo conductor
        Conductor conductor = Conductor.build(
                request.getCorreo(),
                passwordEncoder.encode(request.getContrasena()),
                request.getNombres(),
                request.getApellido_Paterno(),
                request.getApellido_Materno(),
                request.getBoleta(),
                null, // Pasar `null` aquí por ahora, luego se establece después si hay una imagen
                false, // valor por defecto para `aviso_privacidad`
                Role.CONDUCTOR,
                request.getPlacas(),
                request.getDescripcion(),
                request.getModelo(),
                request.getColor()
        );

        // Guardar imagen de perfil (si existe)
        if (request.getFotoPerfil() != null && !request.getFotoPerfil().isEmpty()) {
            byte[] fotoPerfil = fileStorageService.convertToBytes(request.getFotoPerfil());
            conductor.setFotoPerfil(fotoPerfil);
        }

        // Guardar conductor
        userRepositoryCustom.save(conductor);

        return AuthResponse.builder()
                .token(jwtService.getToken(conductor))
                .build();
    }

    public AuthResponse registerPasajero(ConductorRegisterRequest request) {
        User user = User.builder()
                .Correo(request.getCorreo())
                .Contrasena(passwordEncoder.encode(request.getContrasena()))
                .Nombres(request.getNombres())
                .Apellido_Paterno(request.getApellido_Paterno())
                .Apellido_Materno(request.getApellido_Materno())
                .Boleta(request.getBoleta())
                .role(Role.PASAJERO)
                .build();

        userRepositoryCustom.save(user);

        return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .build();

    }
}

