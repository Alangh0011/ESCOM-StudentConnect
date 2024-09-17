package com.example.student_connect.security.User;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;



/**

 * Interfaz que define los métodos de acceso a datos para la entidad Usuario.

 * Esta interfaz extiende la interfaz Spring Data Repository, lo que proporciona métodos CRUD básicos para la entidad Usuario.

 */
@Repository
public interface UsuarioRepositoryCustom extends JpaRepository<User, Integer> {



    /**

     * Método para encontrar un usuario por su nombre de usuario.

     *

     * @param correo El nombre de usuario del usuario a buscar.

     * @return Un objeto Optional que contiene el usuario encontrado, si existe.

     */

    Optional<User> findByCorreo(String correo);



    /**

     * Método para verificar si existe un usuario con un nombre de usuario específico.

     *

     * @param nombreUsuario El nombre de usuario a verificar.

     * @return true si existe un usuario con el nombre de usuario especificado, false de lo contrario.

     */

    boolean existsByNombreUsuario(String nombreUsuario);



    /**

     * Método para verificar si existe un usuario con un correo electrónico específico.

     *

     * @param email El correo electrónico a verificar.

     * @return true si existe un usuario con el correo electrónico especificado, false de lo contrario.

     */

    boolean existsByEmail(String email);

}