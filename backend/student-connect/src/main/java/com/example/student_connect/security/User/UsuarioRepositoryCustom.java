package com.example.student_connect.security.User;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;



/**

 * Interfaz que define los métodos de acceso a datos para la entidad Usuario.

 * Esta interfaz extiende la interfaz Spring Data Repository, lo que proporciona métodos CRUD básicos para la entidad Usuario.

 */
@Repository
public interface UsuarioRepositoryCustom extends JpaRepository<User, Long> {



    /**

     * Método para encontrar un usuario por su nombre de usuario.

     *

     * @param Correo El nombre de usuario del usuario a buscar.

     * @return Un objeto Optional que contiene el usuario encontrado, si existe.

     */

    Optional<User> findByCorreo(String Correo);



}