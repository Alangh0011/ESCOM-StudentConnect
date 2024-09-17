package com.example.student_connect.security.Jwt;

// Importaciones necesarias para el funcionamiento del filtro
import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.StringUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

// La anotación @Component indica que esta clase es un componente de Spring, lo que permite que sea detectado automáticamente y usado donde sea necesario.
// La anotación @RequiredArgsConstructor genera un constructor con todos los campos finales (final) para inyectar las dependencias necesarias.
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Dependencias inyectadas
    private final JwtService jwtService; // Servicio personalizado para manejar operaciones con JWT
    private final UserDetailsService userDetailsService; // Servicio para cargar detalles del usuario

    // Método principal que realiza el filtrado de cada solicitud
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Obtiene el token JWT del encabezado de la solicitud
        final String token = getTokenFromRequest(request);
        final String username;

        // Si no hay token, continúa con la cadena de filtros sin hacer nada
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extrae el nombre de usuario (username) del token
        username = jwtService.getUsernameFromToken(token);

        // Si el nombre de usuario no es nulo y no hay autenticación previa en el contexto de seguridad
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Carga los detalles del usuario usando el UserDetailsService
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Verifica si el token es válido para el usuario
            if (jwtService.isTokenValid(token, userDetails)) {
                // Crea un token de autenticación para el usuario
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // No se requiere una credencial adicional
                        userDetails.getAuthorities() // Autoridades/roles del usuario
                );

                // Establece los detalles de autenticación
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Establece la autenticación en el contexto de seguridad de Spring
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continúa con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    // Método para obtener el token JWT del encabezado de la solicitud
    private String getTokenFromRequest(HttpServletRequest request) {
        // Obtiene el valor del encabezado 'Authorization'
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Comprueba que el encabezado no esté vacío y comience con "Bearer "
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            // Retorna el token, quitando el prefijo "Bearer "
            return authHeader.substring(7);
        }
        return null;
    }
}
