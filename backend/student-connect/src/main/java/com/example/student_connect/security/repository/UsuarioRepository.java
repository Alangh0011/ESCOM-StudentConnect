package com.example.student_connect.security.repository;

import com.example.student_connect.security.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para realizar operaciones CRUD en la entidad Usuario.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    /**
     * Busca un usuario por su número de boleta.
     *
     * @param boleta El número de boleta a buscar.
     * @return Un Optional que contiene el usuario encontrado, si existe.
     */
    Optional<Usuario> findByBoleta(int boleta);

    /**
     * Busca un usuario por su correo electrónico.
     *
     * @param email El correo electrónico a buscar.
     * @return Un Optional que contiene el usuario encontrado, si existe.
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica si existe un usuario con un número de boleta específico.
     *
     * @param boleta El número de boleta a verificar.
     * @return true si existe, false en caso contrario.
     */
    boolean existsByBoleta(int boleta);

    /**
     * Verifica si existe un usuario con un correo electrónico específico.
     *
     * @param email El correo electrónico a verificar.
     * @return true si existe, false en caso contrario.
     */
    boolean existsByEmail(String email);
}
