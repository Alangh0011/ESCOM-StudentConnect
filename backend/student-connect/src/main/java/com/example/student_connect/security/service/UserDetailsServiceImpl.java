package com.example.student_connect.security.service;

import com.example.student_connect.security.entity.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Implementación de Spring Security UserDetailsService para cargar los detalles del usuario por su correo.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioService usuarioService;

    @Autowired
    public UserDetailsServiceImpl(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Método para cargar los detalles del usuario por correo electrónico.
     *
     * @param email El correo del usuario.
     * @return Un objeto UserDetails que representa al usuario.
     * @throws UsernameNotFoundException Si no se encuentra el usuario.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioService.getByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + email));
        // Logs para depuración
        System.out.println("Cargando usuario con email: " + email);
        System.out.println("Contraseña en base de datos: " + usuario.getPassword());

        // Retornamos directamente el usuario, ya que ahora implementa UserDetails
        return usuario;
    }


}
