package com.example.student_connect.security.Config;

// Importaciones necesarias para configurar la seguridad en la aplicación
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.student_connect.security.Jwt.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

// La anotación @Configuration indica que esta clase es una clase de configuración en Spring.
// La anotación @EnableWebSecurity habilita la configuración de seguridad web para esta aplicación.
// La anotación @RequiredArgsConstructor genera un constructor con todos los campos finales (final) para inyectar las dependencias necesarias.
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // Dependencias finales para la seguridad de la aplicación
    private final JwtAuthenticationFilter jwtAuthenticationFilter; // Filtro para la autenticación JWT
    private final AuthenticationProvider authProvider; // Proveedor de autenticación (puede ser un servicio personalizado o un proveedor de Spring Security)

    // Configura la cadena de filtros de seguridad (Security Filter Chain)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Deshabilita CSRF (Cross-Site Request Forgery) ya que la autenticación se maneja mediante JWT y no se usa almacenamiento de sesión
                .csrf(csrf ->
                        csrf
                                .disable())

                // Configura la autorización de solicitudes HTTP
                .authorizeHttpRequests(authRequest ->
                        authRequest
                                // Permite todas las solicitudes que tengan un prefijo "/auth/**" (por ejemplo, login y registro no necesitan autenticación previa)
                                .requestMatchers("/auth/**").permitAll()
                                // Todas las demás solicitudes deben estar autenticadas
                                .anyRequest().authenticated()
                )

                // Configura la gestión de sesiones
                .sessionManagement(sessionManager ->
                        sessionManager
                                // Indica que la aplicación es "stateless", lo que significa que no se usa estado de sesión ya que JWT maneja la autenticación
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configura el proveedor de autenticación (autenticación personalizada o integrada)
                .authenticationProvider(authProvider)

                // Añade el filtro de autenticación JWT antes del filtro de autenticación de usuario/contraseña de Spring Security
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // Construye y devuelve la cadena de filtros de seguridad
                .build();
    }

}
