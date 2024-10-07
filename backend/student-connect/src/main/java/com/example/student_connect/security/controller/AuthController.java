package com.example.student_connect.security.controller;

import com.example.student_connect.security.dto.JwtDto;
import com.example.student_connect.security.dto.LoginUsuario;
import com.example.student_connect.security.dto.NuevoConductor;
import com.example.student_connect.security.dto.NuevoPasajero;
import com.example.student_connect.security.entity.Conductor;
import com.example.student_connect.security.entity.Pasajero;
import com.example.student_connect.security.entity.Rol;
import com.example.student_connect.security.enums.RolNombre;
import com.example.student_connect.security.jwt.JwtProvider;
import com.example.student_connect.security.service.UsuarioService;
import com.example.student_connect.security.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.student_connect.security.utils.Mensaje;
import com.example.student_connect.security.service.BlobStorageService;


import javax.validation.Valid;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    RolService rolService;

    @Autowired
    JwtProvider jwtProvider;

    @Autowired
    BlobStorageService blobStorageService;  // Servicio para manejar Blob Storage

    /**
     * Método para registrar un nuevo pasajero.
     *
     * @param nuevoPasajero   Objeto NuevoPasajero con los datos del nuevo pasajero.
     * @param bindingResult   Resultado de la validación de campos.
     * @return ResponseEntity con un mensaje y un código de estado HTTP.
     */
    @PostMapping(value = "/nuevo/pasajero", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> nuevoPasajero(@ModelAttribute NuevoPasajero nuevoPasajero,
                                           @RequestParam("fotoPerfil") MultipartFile fotoPerfil,
                                           BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(new Mensaje("campos mal puestos o email inválido"), HttpStatus.BAD_REQUEST);
        }
        if (usuarioService.existsByEmail(nuevoPasajero.getEmail())) {
            return new ResponseEntity<>(new Mensaje("Ese email ya existe"), HttpStatus.BAD_REQUEST);
        }
        if (usuarioService.existsByBoleta(nuevoPasajero.getBoleta())) {
            return new ResponseEntity<>(new Mensaje("Esa boleta ya existe"), HttpStatus.BAD_REQUEST);
        }

        String fotoPerfilUrl = null;
        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            try {
                fotoPerfilUrl = blobStorageService.uploadFile(fotoPerfil);  // Guardamos la URL que nos da el servicio
            } catch (IOException e) {
                return new ResponseEntity<>(new Mensaje("Error al subir la imagen"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        Pasajero pasajero = new Pasajero(
                nuevoPasajero.getNombre(),
                nuevoPasajero.getApellidoPaterno(),
                nuevoPasajero.getApellidoMaterno(),
                nuevoPasajero.getEmail(),
                passwordEncoder.encode(nuevoPasajero.getPassword()),
                nuevoPasajero.getBoleta(),
                nuevoPasajero.isAvisoPrivacidad(),
                nuevoPasajero.getSexo()
        );

        if (fotoPerfilUrl != null) {
            pasajero.setFotoPerfilUrl(fotoPerfilUrl);  // Establecemos la URL de la imagen si se proporciona
        }
        Set<Rol> roles = new HashSet<>();
        roles.add(rolService.getByRolNombre(RolNombre.ROLE_PASAJERO).get());
        pasajero.setRoles(roles);
        usuarioService.save(pasajero);
        return new ResponseEntity<>(new Mensaje("pasajero guardado"), HttpStatus.CREATED);
    }

    /**
     * Método para registrar un nuevo conductor.
     *
     * @param nuevoConductor  Objeto NuevoConductor con los datos del nuevo conductor.
     * @param bindingResult   Resultado de la validación de campos.
     * @return ResponseEntity con un mensaje y un código de estado HTTP.
     */
    @PostMapping(value = "/nuevo/conductor", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> nuevoConductor(@ModelAttribute NuevoConductor nuevoConductor,
                                            @RequestParam("fotoPerfil") MultipartFile fotoPerfil,
                                            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(new Mensaje("campos mal puestos o email inválido"), HttpStatus.BAD_REQUEST);
        }
        if (usuarioService.existsByEmail(nuevoConductor.getEmail())) {
            return new ResponseEntity<>(new Mensaje("Ese email ya existe"), HttpStatus.BAD_REQUEST);
        }
        if (usuarioService.existsByBoleta(nuevoConductor.getBoleta())) {
            return new ResponseEntity<>(new Mensaje("Esa boleta ya existe"), HttpStatus.BAD_REQUEST);
        }
        // Subimos la imagen a Blob Storage y obtenemos la URL
        String fotoPerfilUrl = null;
        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            try {
                fotoPerfilUrl = blobStorageService.uploadFile(fotoPerfil);  // Guardamos la URL que nos da el servicio
            } catch (IOException e) {
                return new ResponseEntity<>(new Mensaje("Error al subir la imagen"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        Conductor conductor = new Conductor(
                nuevoConductor.getNombre(),
                nuevoConductor.getApellidoPaterno(),
                nuevoConductor.getApellidoMaterno(),
                nuevoConductor.getEmail(),
                passwordEncoder.encode(nuevoConductor.getPassword()),  // Encriptar la contraseña aquí
                nuevoConductor.getBoleta(),
                nuevoConductor.isAvisoPrivacidad(),
                nuevoConductor.getPlacas(),
                nuevoConductor.getDescripcion(),
                nuevoConductor.getModelo(),
                nuevoConductor.getColor(),
                nuevoConductor.getSexo()
        );

        if (fotoPerfilUrl != null) {
            conductor.setFotoPerfilUrl(fotoPerfilUrl);  // Establecemos la URL de la imagen si se proporciona
        }
        Set<Rol> roles = new HashSet<>();
        roles.add(rolService.getByRolNombre(RolNombre.ROLE_CONDUCTOR).get());
        conductor.setRoles(roles);
        usuarioService.save(conductor);
        return new ResponseEntity<>(new Mensaje("conductor guardado"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginUsuario loginUsuario, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Cambiamos para devolver un ResponseEntity sin un tipo específico
            return new ResponseEntity<>(new Mensaje("Campos mal puestos"), HttpStatus.BAD_REQUEST);
        }
        // Log para depuración
        System.out.println("Intentando autenticar con email: " + loginUsuario.getEmail());

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(loginUsuario.getEmail(), loginUsuario.getPassword())
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtProvider.generateToken(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            JwtDto jwtDto = new JwtDto(jwt, userDetails.getUsername(), userDetails.getAuthorities());

            return new ResponseEntity<>(jwtDto, HttpStatus.OK);
        } catch (Exception e) {
            // Cambiamos para devolver un ResponseEntity sin un tipo específico
            System.out.println("Error al autenticar: " + e.getMessage());
            return new ResponseEntity<>(new Mensaje("Credenciales incorrectas"), HttpStatus.UNAUTHORIZED);
        }
    }


}
