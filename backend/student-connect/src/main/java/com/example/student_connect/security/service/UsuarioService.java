package com.example.student_connect.security.service;

import com.example.student_connect.security.entity.Pasajero;
import com.example.student_connect.security.entity.Usuario;
import com.example.student_connect.security.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Clase de servicio para realizar operaciones relacionadas con la entidad Usuario,
 * incluyendo Pasajero y Conductor.
 */
@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public Optional<Pasajero> getById(Integer id) {
        return usuarioRepository.findById(id).filter(usuario -> usuario instanceof Pasajero)
                .map(usuario -> (Pasajero) usuario);
    }

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Método para obtener un usuario por su número de boleta.
     *
     * @param boleta El número de boleta a buscar.
     * @return Un objeto Optional que contiene el usuario encontrado, si existe.
     */
    public Optional<Usuario> getByBoleta(int boleta) {
        return usuarioRepository.findByBoleta(boleta);
    }

    /**
     * Método para obtener un usuario por su correo electrónico.
     *
     * @param email El correo electrónico a buscar.
     * @return Un objeto Optional que contiene el usuario encontrado, si existe.
     */
    public Optional<Usuario> getByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    /**
     * Método para verificar si existe un usuario con un número de boleta específico.
     *
     * @param boleta El número de boleta a verificar.
     * @return true si existe un usuario con el número de boleta especificado, false de lo contrario.
     */
    public boolean existsByBoleta(int boleta) {
        return usuarioRepository.existsByBoleta(boleta);
    }

    /**
     * Método para verificar si existe un usuario con un correo electrónico específico.
     *
     * @param email El correo electrónico a verificar.
     * @return true si existe un usuario con el correo electrónico especificado, false de lo contrario.
     */
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    /**
     * Método para guardar un usuario en la base de datos.
     * Este método maneja tanto Pasajero como Conductor.
     *
     * @param usuario El usuario a guardar (puede ser Pasajero o Conductor).
     */
    public void save(Usuario usuario) {
        usuarioRepository.save(usuario);
    }
}
